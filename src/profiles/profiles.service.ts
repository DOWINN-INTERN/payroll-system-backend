import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { IProfile } from 'src/common/interfaces';
import { plainToInstance } from 'class-transformer';
import { ProfileDto } from './dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async findOneById(id: string): Promise<IProfile> {
    const profile = await this.profilesRepository.findOne({
      relations: { user: true },
      where: { user: { id: id } },
    });
    return plainToInstance(ProfileDto, profile);
  }

  async findOneByUsername(username: string) {
    const profile = await this.profilesRepository.findOne({
      where: { user: { username: username } },
    });
    return profile;
  }
}
