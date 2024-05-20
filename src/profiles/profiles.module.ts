import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities';
import { Profile } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
