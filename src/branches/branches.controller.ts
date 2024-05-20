import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { MemberGuard, OrganizationGuard } from 'src/common/guards';
import { IamGuard } from 'src/common/guards/iam.guard';
import { Role } from 'src/common/enums';
import { Permissions, Roles } from 'src/common/decorators';

@UseGuards(OrganizationGuard, MemberGuard)
@Controller()
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @UseGuards(IamGuard)
  @Roles(Role.Member)
  @Permissions({ subject: 'branches', action: 'create' })
  createBranch(
    @Param('organization') organization: string,
    @Body() createBranchDto: CreateBranchDto,
  ) {
    return this.branchesService.create(organization, createBranchDto);
  }

  @Get()
  findBranches(@Param('organization') organization: string) {
    return this.branchesService.findAll(organization);
  }

  @Get(':branch')
  findOneBranch(
    @Param('organization') organization: string,
    @Param('branch') branch: string,
  ) {
    return this.branchesService.findOne(organization, branch);
  }

  @Patch(':branch')
  updateBranch(
    @Param('organization') organization: string,
    @Param('branch') branch: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchesService.update(organization, branch, updateBranchDto);
  }

  @Delete(':branch')
  removeBranch(
    @Param('organization') organization: string,
    @Param('branch') branch: string,
  ) {
    return this.branchesService.remove(organization, branch);
  }
}
