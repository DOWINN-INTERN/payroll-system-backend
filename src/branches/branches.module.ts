import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities';
import { Department } from 'src/departments/entities';
import { Role } from 'src/iam/entities';
import { Branch } from './entities';
import { Organization } from 'src/organizations/entities';
import { HelperService, StringHelper } from 'src/common/helpers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Organization, Department, Member, Role]),
  ],
  controllers: [BranchesController],
  providers: [BranchesService, HelperService, StringHelper],
  exports: [BranchesService],
})
export class BranchesModule {}
