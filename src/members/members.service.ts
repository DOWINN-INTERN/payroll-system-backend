import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MembershipStatus } from 'src/common/enums';
import {
  AddMemberDto,
  CreateMemberDto,
  MemberDto,
  SetBranchDto,
  SetDepartmentDto,
} from './dto';
import { Member } from './entities';
import { Branch } from 'src/branches/entities';
import { Department } from 'src/departments/entities';
import { CredentialsService } from './credentials.service';
import { Organization } from 'src/organizations/entities';
import { User } from 'src/users/entities';

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);

  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
    private credentialsService: CredentialsService,
  ) {}

  async addMember(alias: string, addMemberDto: AddMemberDto) {
    const org = await this.organizationsRepository.findOneBy({
      alias,
    });
    const user = await this.usersRepository.findOneBy({
      email: addMemberDto.email,
    });
    if (!org || !user) throw new NotFoundException();
    const isMember = await this.membersRepository.exists({
      where: {
        organization: { alias },
        user: { email: addMemberDto.email },
      },
    });
    if (isMember) throw new ConflictException();

    const newMember = this.membersRepository.create({
      organization: org,
      user: user,
    });
    const member = await this.membersRepository.save(newMember);
    return member;
  }

  async findAll(alias: string) {
    const org = await this.organizationsRepository.findOneBy({
      alias,
    });
    if (!org) throw new NotFoundException();
    const members = await this.membersRepository.find({
      //relations: { user: { profile: true }, organization: true },
      relations: {
        organization: true,
        branch: true,
        department: true,
        user: true,
        credential: true,
        role: true,
      },
      where: {
        organization: { alias },
        membership: MembershipStatus.ACCEPTED,
      },
    });
    return members;
    //return plainToInstance(MemberDto, members);
  }

  async findOne(alias: string, memberId: string) {
    const org = await this.organizationsRepository.findOneBy({
      alias,
    });
    if (!org) throw new NotFoundException();
    const member = await this.membersRepository.findOne({
      //relations: { user: { profile: true }, organization: true },
      relations: {
        user: true,
        organization: true,
        branch: true,
        department: true,
      },
      where: {
        organization: { alias },
        id: memberId,
        membership: MembershipStatus.ACCEPTED,
      },
    });
    if (!member) throw new NotFoundException();
    return member;
    //return plainToInstance(MemberDto, member);
  }

  async getMemberCredential(alias: string, memberId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const member = await queryRunner.manager.findOne(Member, {
        relations: { credential: true },
        where: {
          organization: { alias: alias },
          id: memberId,
          membership: MembershipStatus.ACCEPTED,
        },
      });
      if (!member) throw new ForbiddenException();
      const memberCredential =
        await this.credentialsService.getMemberCredential(member);

      await queryRunner.commitTransaction();

      return memberCredential;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateMemberCredential(alias: string, memberId: string, body: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const member = await queryRunner.manager.findOne(Member, {
        where: {
          organization: { alias: alias },
          id: memberId,
        },
      });

      const memberCredential =
        await this.credentialsService.getMemberCredential(member);
      const updatedCredential = await this.credentialsService.updateCredential(
        memberCredential,
        { ...body },
      );
      await queryRunner.commitTransaction();
      return updatedCredential;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async pending(alias: string) {
    const org = await this.organizationsRepository.findOneBy({
      alias,
    });
    if (!org) throw new NotFoundException();
    const members = await this.membersRepository.find({
      relations: { user: { profile: true }, organization: true },
      where: {
        organization: { alias },
        membership: MembershipStatus.PENDING,
      },
    });
    return plainToInstance(MemberDto, members);
  }

  async approveMemberNew(alias: string, body: { email: string }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = await queryRunner.manager.findOne(Organization, {
        where: { alias: alias },
      });
      if (!organization) throw new NotFoundException();
      const user = await queryRunner.manager.findOne(User, {
        where: { email: body.email },
      });
      if (!user) throw new NotFoundException();
      const pendingMember = await queryRunner.manager.findOne(Member, {
        where: {
          organization: { id: organization.id },
          user: { id: user.id },
          membership: MembershipStatus.PENDING,
        },
      });
      if (!pendingMember) throw new NotFoundException();
      const credential = await this.credentialsService.createCredential(user);
      const member = await queryRunner.manager.update(
        Member,
        pendingMember.id,
        {
          membership: MembershipStatus.ACCEPTED,
          credential: credential,
        },
      );
      await queryRunner.commitTransaction();
      return member;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async declineMember(alias: string, createMemberDto: CreateMemberDto) {
    const org = await this.organizationsRepository.findOneBy({
      alias,
    });
    const user = await this.usersRepository.findOneBy({
      email: createMemberDto.email,
    });
    if (!org || !user) throw new NotFoundException();

    const member = await this.membersRepository.findOne({
      relations: { user: { profile: true }, organization: true },
      where: {
        organization: { alias },
        user: { id: user.id },
        membership: MembershipStatus.PENDING,
      },
    });

    if (!member) throw new NotFoundException();
    const declinedMember = await this.membersRepository.update(member.id, {
      membership: MembershipStatus.DECLINED,
    });
    return declinedMember;
  }

  async setBranch(organizationAlias: string, body: SetBranchDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const branch = await queryRunner.manager.findOne(Branch, {
        where: {
          organization: { alias: organizationAlias },
          branch_alias: body.branch,
        },
      });
      if (!branch) throw new NotFoundException();
      const member = await queryRunner.manager.findOne(Member, {
        where: {
          user: { id: body.id },
          organization: { alias: organizationAlias },
          membership: MembershipStatus.ACCEPTED,
        },
      });
      if (!member) throw new ForbiddenException('SetBranch Error');
      await queryRunner.manager.update(Member, member.id, { branch: branch });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async setDepartment(organizationAlias: string, body: SetDepartmentDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const branch = await queryRunner.manager.findOne(Branch, {
        where: {
          organization: { alias: organizationAlias },
          branch_alias: body.branch,
        },
      });
      if (!branch) throw new NotFoundException();
      const department = await queryRunner.manager.findOne(Department, {
        where: {
          organization: { alias: organizationAlias },
          branch: { branch_alias: body.branch },
          alias: body.department,
        },
      });
      if (!department) throw new NotFoundException();
      const member = await queryRunner.manager.findOne(Member, {
        where: {
          user: { id: body.id },
          organization: { alias: organizationAlias },
          branch: { branch_alias: body.branch },
          membership: MembershipStatus.ACCEPTED,
        },
      });

      if (!member) throw new ForbiddenException('SetDepartment Error');
      await queryRunner.manager.update(Member, member.id, {
        department: department,
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
