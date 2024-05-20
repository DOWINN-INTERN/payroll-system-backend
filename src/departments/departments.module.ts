import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities';
import { Role } from 'src/iam/entities';
import { HelperService, StringHelper } from 'src/common/helpers';
import { Department } from './entities';
import { Branch } from 'src/branches/entities';
import { Member } from 'src/members/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, Branch, Organization, Member, Role]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, HelperService, StringHelper],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
