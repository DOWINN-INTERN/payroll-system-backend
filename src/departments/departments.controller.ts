import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Permissions, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { IamGuard } from 'src/common/guards';
import { CreateDepartmentDto } from './dto';

@Controller()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UseGuards(IamGuard)
  @Roles(Role.Member)
  @Permissions({ subject: 'department', action: 'create' })
  createDepartment(
    @Param('organization') organization: string,
    @Param('branch') branch: string,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentsService.createDepartment(
      organization,
      branch,
      createDepartmentDto,
    );
  }

  @Get()
  findAllDepartments(
    @Param('organization') organization: string,
    @Param('branch') branch: string,
  ) {
    return this.departmentsService.findAllDepartments(organization, branch);
  }

  @Get(':department')
  findOneDepartment(
    @Param('organization') organization: string,
    @Param('branch') branch: string,
    @Param('department') department: string,
  ) {
    return this.departmentsService.findOneDepartment(
      organization,
      branch,
      department,
    );
  }

  @Patch(':department')
  update(
    @Param('organization') organization: string,
    @Param('branch') branch: string,
    @Param('department') department: string,
    @Body() updateDepartmentDto: any,
  ) {
    return this.departmentsService.updateDepartment(
      organization,
      branch,
      department,
      updateDepartmentDto,
    );
  }
}
