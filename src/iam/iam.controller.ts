import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IamService } from './iam.service';
import { CreateIamDto, SetRoleDto } from './dto';

@Controller()
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post()
  create(
    @Param('organization') organization: string,
    @Body() createIamDto: CreateIamDto,
  ) {
    return this.iamService.create(organization, createIamDto);
  }

  @Get()
  findAll(@Param('organization') organization: string) {
    return this.iamService.findAll(organization);
  }

  @Get('roles')
  findRoles(
    @Param('organization') organization: string,
    @Query('branch') branch: string,
    @Query('department') department: string,
  ) {
    if (!branch && !department) {
      return this.iamService.findRoles(organization);
    }
    if (branch && !department) {
      return this.iamService.findRolesByBranch(organization, branch);
    }
    if (branch && department) {
      return this.iamService.findRolesByBranchDepartment(
        organization,
        branch,
        department,
      );
    }
  }

  @Post('role')
  assignRole(
    @Param('organization') organization: string,
    @Body() setRoleDto: SetRoleDto,
  ) {
    return this.iamService.assignRole(organization, setRoleDto);
  }
}
