import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Organization } from 'src/organizations/entities';
import { HelperService } from 'src/common/helpers';
import { Department } from './entities';
import { Branch } from 'src/branches/entities';
@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,

    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,

    private dataSource: DataSource,

    private helperService: HelperService,
  ) {}

  async createDepartment(
    organizationAlias: string,
    branchAlias: string,
    body: CreateDepartmentDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { name } = body;
    const departmentAlias = this.helperService.createAlias(name);
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organization = await queryRunner.manager.findOne(Organization, {
        where: { alias: organizationAlias },
      });
      if (!organization) throw new NotFoundException();
      const branch = await queryRunner.manager.findOne(Branch, {
        where: {
          organization: { alias: organizationAlias },
          branch_alias: branchAlias,
        },
      });
      if (!branch) throw new NotFoundException();
      const departmentInstance = queryRunner.manager.create(Department, {
        name: name,
        alias: departmentAlias,
        organization: organization,
        branch: branch,
      });
      const department = await queryRunner.manager.save(
        Department,
        departmentInstance,
      );
      await queryRunner.commitTransaction();
      return department;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw error;
    } finally {
      await queryRunner.release();
      this.logger.debug('Query Runner Released');
    }
  }

  async findAllDepartments(organizationAlias: string, branchAlias: string) {
    const branch = await this.branchesRepository.findOne({
      relations: { organization: true },
      where: {
        organization: { alias: organizationAlias },
        branch_alias: branchAlias,
      },
    });

    if (!branch) throw new NotFoundException();

    const departments = await this.departmentsRepository.find({
      relations: { branch: true, organization: true },
      where: {
        branch: { branch_alias: branchAlias },
      },
    });
    return departments;
  }

  async findOneDepartment(
    alias: string,
    branchAlias: string,
    departmentAlias: string,
  ) {
    const branch = await this.branchesRepository.findOne({
      relations: { organization: true },
      where: {
        organization: { alias: alias },
        branch_alias: branchAlias,
      },
    });

    if (!branch) throw new NotFoundException();
    const department = await this.departmentsRepository.findOne({
      relations: { branch: true, organization: true },
      where: {
        branch: { branch_alias: branchAlias },
        alias: departmentAlias,
      },
    });
    if (!department) throw new NotFoundException();

    return department;
  }

  async updateDepartment(
    alias: string,
    branchAlias: string,
    departmentAlias: string,
    body: any,
  ) {
    const branch = await this.branchesRepository.findOne({
      relations: { organization: true },
      where: {
        organization: { alias: alias },
        branch_alias: branchAlias,
      },
    });
    if (!branch) throw new NotFoundException();
    const department = await this.departmentsRepository.findOne({
      relations: { branch: true, organization: true },
      where: {
        branch: { branch_alias: branchAlias },
        alias: departmentAlias,
      },
    });
    if (!department) throw new NotFoundException();
    if (body.branchAlias) {
      this.logger.debug('With Branch Alias in payload...');
      const newBranchUpdate = await this.branchesRepository.findOne({
        where: {
          organization: { alias: alias },
          branch_alias: body.branchAlias,
        },
      });
      this.logger.debug({ ...newBranchUpdate });

      const updateBranch = await this.departmentsRepository.update(
        department.id,
        { name: body.name, branch: newBranchUpdate },
      );
      return updateBranch;
    } else {
      this.logger.debug('Without Branch Alias in payload...');

      const updateBranch = await this.departmentsRepository.update(
        department.id,
        { name: body.name },
      );
      return updateBranch;
    }
  }
}
