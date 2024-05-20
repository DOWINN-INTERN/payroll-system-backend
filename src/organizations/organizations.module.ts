import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesModule } from 'src/branches/branches.module';
import { DepartmentsModule } from 'src/departments/departments.module';
import { Role } from 'src/iam/entities';
import { HelperService, StringHelper } from '../common/helpers';
import { MembersModule } from 'src/members/members.module';
import { UsersModule } from 'src/users/users.module';
import { Organization } from './entities';
import { Branch } from 'src/branches/entities';
import { Department } from 'src/departments/entities';
import { User } from 'src/users/entities';
import { Credential, Member } from 'src/members/entities';

@Module({
  imports: [
    UsersModule,
    BranchesModule,
    DepartmentsModule,
    MembersModule,
    TypeOrmModule.forFeature([
      Organization,
      Branch,
      Department,
      User,
      Member,
      Credential,
      Role,
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, HelperService, StringHelper],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
