import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';

import { DataSource, IsNull } from 'typeorm';
import { Organization } from 'src/organizations/entities';
import { Branch } from 'src/branches/entities';
import { Department } from 'src/departments/entities';
import { Permission, Role } from './entities';
import { CreateIamDto, SetRoleDto } from './dto';
import { Member } from 'src/members/entities';

@Injectable()
export class IamService {
  private readonly logger = new Logger(IamService.name);

  constructor(private dataSource: DataSource) {}
  async create(organizationAlias: string, createIamDto: CreateIamDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = await queryRunner.manager.findOne(Organization, {
        where: { alias: organizationAlias },
      });
      if (!organization)
        throw new NotFoundException(
          `${IamService.name} — Organization not found`,
        );
      let branch: Branch = null;
      let department: Department = null;
      if (createIamDto.branchId) {
        branch = await queryRunner.manager.findOne(Branch, {
          where: {
            id: createIamDto.branchId,
            organization: { alias: organizationAlias },
          },
        });
        if (!branch)
          throw new NotFoundException(`${IamService.name} — Branch not found`);
      }
      if (createIamDto.departmentId) {
        department = await queryRunner.manager.findOne(Department, {
          where: {
            id: createIamDto.departmentId,
            organization: { alias: organizationAlias },
          },
        });
        if (!department)
          throw new NotFoundException(
            `${IamService.name} — Department not found`,
          );
      }
      const permissions = await queryRunner.manager.save(
        Permission,
        createIamDto.permissions,
      );
      if (permissions.length <= 0)
        throw new PreconditionFailedException('Permission cannot be empty');

      const roleInstance = queryRunner.manager.create(Role, {
        name: createIamDto.name,
        organization: organization,
        branch: branch,
        department: !branch ? null : department,
        permissions: permissions,
      });
      const role = await queryRunner.manager.save(roleInstance);
      await queryRunner.commitTransaction();
      return role;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(organizationAlias: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roles = await queryRunner.manager.find(Role, {
        relations: {
          organization: true,
          branch: true,
          department: true,
          permissions: true,
        },
        where: { organization: { alias: organizationAlias } },
      });
      if (!roles) throw new NotFoundException();
      await queryRunner.commitTransaction();
      return roles;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findRolesByBranch(organizationAlias: string, branch: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roles = await queryRunner.manager.find(Role, {
        relations: { permissions: true, branch: true, department: true },
        where: {
          organization: { alias: organizationAlias },
          branch: { branch_alias: branch },
          department: IsNull(),
        },
      });
      await queryRunner.commitTransaction();
      return roles;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async findRolesByBranchDepartment(
    organizationAlias: string,
    branch: string,
    department: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roles = await queryRunner.manager.find(Role, {
        relations: { permissions: true, branch: true, department: true },
        where: {
          organization: { alias: organizationAlias },
          branch: { branch_alias: branch },
          department: { alias: department },
        },
      });
      await queryRunner.commitTransaction();
      return roles;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
    } finally {
      await queryRunner.release();
    }
  }
  async findRoles(organizationAlias: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const roles = await queryRunner.manager.find(Role, {
        relations: { permissions: true, branch: true, department: true },
        where: {
          organization: { alias: organizationAlias },
          branch: IsNull(),
          department: IsNull(),
        },
      });
      await queryRunner.commitTransaction();
      return roles;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async assignRole(organizationAlias: string, setRoleDto: SetRoleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const member = await queryRunner.manager.findOne(Member, {
        relations: { branch: true, department: true },
        where: {
          id: setRoleDto.memberId,
          organization: { alias: organizationAlias },
        },
      });
      if (!member) throw new NotFoundException();
      this.logger.debug({ ...member });
      if (member.branch === null) {
        const role = await queryRunner.manager.findOne(Role, {
          relations: { branch: true, department: true },
          where: {
            id: setRoleDto.roleId,
          },
        });
        await queryRunner.manager.update(Member, member.id, { role: role });
        await queryRunner.commitTransaction();
      } else {
        const role = await queryRunner.manager.findOne(Role, {
          relations: { branch: true, department: true },
          where: {
            id: setRoleDto.roleId,
          },
        });
        if (member.branch.id !== role.branch.id)
          throw new ForbiddenException('Member and Role branch not matched');
        if (member.department.id !== role.department.id)
          throw new ForbiddenException(
            'Member and Role department not matched',
          );
        await queryRunner.manager.update(Member, member.id, { role: role });
        await queryRunner.commitTransaction();
      }
      this.logger.debug('Role Assigned');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
