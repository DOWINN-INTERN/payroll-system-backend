import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { Profile } from 'src/profiles/entities';
import { Organization } from 'src/organizations/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Organization])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
