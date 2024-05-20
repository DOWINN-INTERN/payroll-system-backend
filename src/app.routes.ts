import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { OrganizationsModule } from './organizations/organizations.module';
import { BranchesModule } from './branches/branches.module';
import { DepartmentsModule } from './departments/departments.module';
import { MembersModule } from './members/members.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'organizations',
        module: OrganizationsModule,
        children: [
          {
            path: ':organization/branches',
            module: BranchesModule,
            children: [
              { path: ':branch/departments', module: DepartmentsModule },
            ],
          },
          {
            path: ':organization/members',
            module: MembersModule,
          },
          {
            path: ':organization/iam',
            module: IamModule,
          },
        ],
      },
    ]),
  ],
})
export class AppRoutes {}
