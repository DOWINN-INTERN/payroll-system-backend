import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
