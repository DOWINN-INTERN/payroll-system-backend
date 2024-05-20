import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'src/common/interfaces';
import { plainToInstance } from 'class-transformer';
import { User } from './entities';
import { UserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOneUserById(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.usersRepository.find();
    return plainToInstance(UserDto, users);
  }
}
