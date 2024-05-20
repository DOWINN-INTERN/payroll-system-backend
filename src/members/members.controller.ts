import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { IamGuard, MemberGuard } from 'src/common/guards';
import { SetBranchDto, SetDepartmentDto } from './dto';
import { Permissions, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';

@UseGuards(MemberGuard)
@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('department')
  setDepartment(
    @Param('organization') organization: string,
    @Body() setDepartmentDto: SetDepartmentDto,
  ) {
    return this.membersService.setDepartment(organization, setDepartmentDto);
  }

  @Post('branch')
  setBranch(
    @Param('organization') organization: string,
    @Body() setBranchDto: SetBranchDto,
  ) {
    return this.membersService.setBranch(organization, setBranchDto);
  }

  @Get('pending')
  pending(@Param('organization') organization: string) {
    return this.membersService.pending(organization);
  }
  //TODO — Endpoint of User Join Request
  @Post('approval')
  @UseGuards(IamGuard)
  @Permissions({ subject: 'member', action: 'accept' })
  approval(
    @Param('organization') organization: string,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.membersService.approveMemberNew(organization, createMemberDto);
  }

  @Post('decline')
  decline(
    @Param('organization') organization: string,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.membersService.declineMember(organization, createMemberDto);
  }

  // Direct Addition of Members
  @Post()
  create(
    @Param('organization') organization: string,
    @Body() createMemberDto: CreateMemberDto,
  ) {
    return this.membersService.addMember(organization, createMemberDto);
  }

  @Get()
  @UseGuards(IamGuard)
  @Roles(Role.Member)
  @Permissions({ subject: 'member', action: 'read' })
  findAll(@Param('organization') organization: string) {
    return this.membersService.findAll(organization);
  }

  @Get(':id')
  findOne(
    @Param('organization') organization: string,
    @Param('id') memberId: string,
  ) {
    return this.membersService.findOne(organization, memberId);
  }

  @Get(':id/credential')
  getMemberCredential(
    @Param('organization') organization: string,
    @Param('id') memberId: string,
  ) {
    return this.membersService.getMemberCredential(organization, memberId);
  }

  @Patch(':id/credential')
  updateMemberCredential(
    @Param('organization') organization: string,
    @Param('id') memberId: string,
    @Body() updateMemberCredentialDto: any,
  ) {
    return this.membersService.updateMemberCredential(
      organization,
      memberId,
      updateMemberCredentialDto,
    );
  }
}
