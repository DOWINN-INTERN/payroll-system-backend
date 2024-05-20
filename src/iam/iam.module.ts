import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role } from './entities';
import { Member } from 'src/members/entities';
import { Organization } from 'src/organizations/entities';
import { Branch } from 'src/branches/entities';
import { Department } from 'src/departments/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Permission,
      Member,
      Organization,
      Branch,
      Department,
    ]),
  ],
  controllers: [IamController],
  providers: [IamService],
})
export class IamModule {}
