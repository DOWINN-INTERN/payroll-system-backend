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
import { OrganizationsService } from './organizations.service';
import { Roles, UserId } from 'src/common/decorators';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { IamGuard, OrganizationGuard, RolesGuard } from 'src/common/guards';
import { Role } from 'src/common/enums';

@UseGuards(OrganizationGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  createOrganization(
    @UserId() id: string,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationsService.createOrganization(
      id,
      createOrganizationDto,
    );
  }

  @Get()
  async findAllOrganizations(@UserId() id: string) {
    return this.organizationsService.findAllOrganization(id);
  }

  @Get(':organization')
  @UseGuards(IamGuard)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Member, Role.Owner)
  // @Permissions(
  //   { subject: 'organization', action: 'read' },
  //   { subject: 'all', action: 'manage' },
  // )
  findOneOrganization(
    @Param('organization') organization: string,
    @UserId() userId: string,
  ) {
    return this.organizationsService.findOneOrganization(userId, organization);
  }

  @Patch(':organization')
  @UseGuards(RolesGuard)
  @Roles(Role.Owner)
  updateOrganization(
    @UserId() userId: string,
    @Param('organization') organization: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(
      userId,
      organization,
      updateOrganizationDto,
    );
  }

  @Delete(':organization')
  @UseGuards(RolesGuard)
  @Roles(Role.Owner)
  removeOrganization(
    @UserId() userId: string,
    @Param('organization') organization: string,
  ) {
    return this.organizationsService.remove(userId, organization);
  }

  @Post('join')
  joinOrganization(
    @UserId() user_id: string,
    @Body() invitation_code: { invitationCode: string },
  ) {
    return this.organizationsService.join(
      user_id,
      invitation_code.invitationCode,
    );
  }

  //Invitation Route
  @Get('invitation/:code')
  invitation(@Param('code') invitation_code: string) {
    return this.organizationsService.invitation(invitation_code);
  }

  @Get(':organization/departments')
  findAllDepartments(@Param('organization') organization: string) {
    return this.organizationsService.findAllDepartments(organization);
  }
}
