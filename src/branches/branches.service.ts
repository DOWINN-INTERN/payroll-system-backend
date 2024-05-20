import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository, UpdateResult } from 'typeorm';
import { BranchDto, CreateBranchDto, UpdateBranchDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { IBranch } from 'src/common/interfaces';
import { Organization } from 'src/organizations/entities';
import { HelperService } from 'src/common/helpers';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private branchesRepository: Repository<Branch>,
    @InjectRepository(Organization)
    private orgsRepository: Repository<Organization>,
    private helperService: HelperService,
  ) {}

  async create(alias: string, body: CreateBranchDto): Promise<IBranch> {
    const { name } = body;
    const branchAlias = this.helperService.createAlias(name);
    const org = await this.orgsRepository.findOneBy({ alias });
    if (!org) throw new NotFoundException();
    const branch = this.branchesRepository.create({
      organization: org,
      name: name,
      branch_alias: branchAlias,
    });
    const result = await this.branchesRepository.save(branch);
    return plainToInstance(BranchDto, result);
  }

  async findAll(alias: string): Promise<IBranch[]> {
    const branches = await this.branchesRepository.find({
      relations: { organization: true },
      where: {
        organization: { alias },
      },
    });
    return plainToInstance(BranchDto, branches);
  }

  async findOne(
    organizationAlias: string,
    branchAlias: string,
  ): Promise<IBranch> {
    const branch = await this.branchesRepository.findOne({
      relations: { organization: true },
      where: {
        organization: { alias: organizationAlias },
        branch_alias: branchAlias,
      },
    });
    if (!branch) throw new NotFoundException();
    return plainToInstance(BranchDto, branch);
  }

  async update(
    organizationAlias: string,
    branchAlias: string,
    updateBranchDto: UpdateBranchDto,
  ) {
    const branch = await this.branchesRepository.findOne({
      relations: { organization: true },
      where: {
        organization: { alias: organizationAlias },
        branch_alias: branchAlias,
      },
    });
    if (!branch) throw new NotFoundException();
    const result = await this.branchesRepository.update(
      {
        branch_alias: branchAlias,
      },
      updateBranchDto,
    );
    return result;
  }

  async remove(
    organizationAlias: string,
    branchAlias: string,
  ): Promise<UpdateResult> {
    const branch = await this.branchesRepository.findOne({
      relations: { organization: true },
      where: {
        organization: { alias: organizationAlias },
        branch_alias: branchAlias,
      },
    });

    if (!branch) throw new NotFoundException();
    const result = await this.branchesRepository.softDelete({
      organization: { alias: organizationAlias },
      branch_alias: branchAlias,
    });
    return result;
  }
}
