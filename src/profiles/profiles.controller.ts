import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UserId } from 'src/common/decorators';

@Controller('profiles')
export class ProfilesController {
  private readonly logger = new Logger(ProfilesController.name);

  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async findOneById(@UserId() loggedUser: string) {
    return this.profilesService.findOneById(loggedUser);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.profilesService.findOneByUsername(username);
  }
}
