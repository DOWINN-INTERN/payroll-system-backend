import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { nanoid } from 'nanoid';
import { Organization } from './entities';
import { Member } from 'src/members/entities';
import { IOrganization } from 'src/common/interfaces';
import { MembershipStatus, Role } from 'src/common/enums';
import {
  CreateOrganizationDto,
  DepartmentOrganizationDto,
  OrganizationDto,
  UpdateOrganizationDto,
} from './dto';
import { Department } from 'src/departments/entities';
import { HelperService } from '../common/helpers';
import { CredentialsService } from 'src/members/credentials.service';
import { UsersService } from 'src/users/users.service';
import { Permission } from 'src/iam/entities';
import { Role as RoleEntity } from 'src/iam/entities';
import { User } from 'src/users/entities';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    private dataSource: DataSource,
    private userService: UsersService,
    private credentialsService: CredentialsService,
    private helperService: HelperService,
  ) {}

  async createOrganization(
    userId: string,
    body: CreateOrganizationDto,
  ): Promise<IOrganization> {
    const queryRunner = this.dataSource.createQueryRunner();
    const { name } = body;
    const invitationCode = nanoid();
    const alias = this.helperService.createAlias(name);
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      const organizationInstance = queryRunner.manager.create(Organization, {
        creator: user,
        invitation: invitationCode,
        name: name,
        alias: alias,
      });
      const organization = await queryRunner.manager.save(
        Organization,
        organizationInstance,
      );
      const credential = await this.credentialsService.createCredential(user);

      const permissionInstance = queryRunner.manager.create(Permission, {
        subject: 'all',
        action: 'manage',
      });
      const permission = await queryRunner.manager.save(
        Permission,
        permissionInstance,
      );
      const roleInstance = queryRunner.manager.create(RoleEntity, {
        name: Role.Owner,
        organization: organization,
        permissions: [permission],
      });
      const role = await queryRunner.manager.save(RoleEntity, roleInstance);
      const member = queryRunner.manager.create(Member, {
        user: user,
        organization: organization,
        membership: MembershipStatus.ACCEPTED,
        role: role,
        credential: credential,
      });
      await queryRunner.manager.save(Member, member);
      const membersCount = await queryRunner.manager.count(Member, {
        where: {
          organization: { id: organization.id },
          membership: MembershipStatus.ACCEPTED,
        },
      });
      const newOrg = plainToInstance(OrganizationDto, organization);
      newOrg.membersCount = membersCount;
      await queryRunner.commitTransaction();
      return newOrg;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOrganization(userId: string): Promise<IOrganization[]> {
    const orgs = await this.organizationsRepository.find({
      relations: { creator: true },
      where: {
        members: {
          user: { id: userId },
          membership: MembershipStatus.ACCEPTED,
        },
      },
    });
    const orgsWithCounts = await Promise.all(
      orgs.map(async (org) => {
        const membersCount = await this.membersRepository.count({
          where: {
            organization: { id: org.id },
            membership: MembershipStatus.ACCEPTED,
          },
        });
        return { organization: org, membersCount: membersCount };
      }),
    );

    return orgsWithCounts.map(({ organization, membersCount }) => {
      const org = plainToInstance(OrganizationDto, organization);
      org.membersCount = membersCount;
      return org;
    });
  }

  async findOneOrganization(
    userId: string,
    alias: string,
  ): Promise<IOrganization> {
    const org = await this.organizationsRepository.findOne({
      relations: { creator: true },
      where: {
        alias: alias,
        members: { user: { id: userId } },
      },
    });
    return plainToInstance(OrganizationDto, org);
  }
  // ⬜ Try to use Organization Id
  // Only Creator can update Organization
  // Update Organization Associated with current logged User
  async update(
    userId: string,
    alias: string,
    body: UpdateOrganizationDto,
  ): Promise<IOrganization> {
    const { name } = body;
    const organization = await this.organizationsRepository.findOne({
      relations: { creator: true },
      where: { alias },
    });

    if (!organization) throw new NotFoundException();

    const newAlias = this.helperService.createAlias(name);

    this.organizationsRepository.merge(organization, {
      name: name,
      alias: newAlias,
    });
    const updatedOrganization =
      await this.organizationsRepository.save(organization);
    return plainToInstance(OrganizationDto, updatedOrganization);
  }
  // Only Creator can soft-delete Organization
  // Soft Delete Organization Associated with current logged User
  async remove(userId: string, alias: string): Promise<UpdateResult> {
    const result = await this.organizationsRepository.softDelete({
      alias,
    });
    return result;
  }

  // Invitation Route
  async invitation(invitation_code: string) {
    const organization = await this.organizationsRepository.findOne({
      relations: { creator: true },
      where: { invitation: invitation_code },
    });
    if (!organization) throw new NotFoundException();
    return plainToInstance(OrganizationDto, organization);
  }

  async join(userId: string, invitationCode: string) {
    const org = await this.organizationsRepository.findOne({
      where: { invitation: invitationCode },
    });
    const user = await this.userService.findOneUserById(userId);
    if (!org || !user) throw new NotFoundException();
    const isMember = await this.membersRepository.exists({
      where: {
        organization: { invitation: invitationCode },
        user: { id: userId },
        membership: MembershipStatus.PENDING,
      },
    });
    if (isMember) throw new ConflictException();

    //const credential = await this.credentialsService.createCredential(user);

    const memberInstance = this.membersRepository.create({
      organization: org,
      user: user,
      //credential: credential,
    });
    const member = await this.membersRepository.save(memberInstance);

    return member;
  }

  async findAllDepartments(organization: string) {
    const departments = await this.departmentsRepository.find({
      relations: { branch: true, organization: true },
      where: { organization: { alias: organization } },
    });
    return plainToInstance(DepartmentOrganizationDto, departments);
  }
}
