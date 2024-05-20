import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/iam/entities';
import { CredentialsService } from './credentials.service';
import { Credential, Member } from './entities';
import { User } from 'src/users/entities';
import { Profile } from 'src/profiles/entities';
import { Organization } from 'src/organizations/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      Credential,
      User,
      Profile,
      Organization,
      Role,
    ]),
  ],
  controllers: [MembersController],
  providers: [MembersService, CredentialsService],
  exports: [CredentialsService],
})
export class MembersModule {}
