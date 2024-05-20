import { Exclude, Expose, Type } from 'class-transformer';
import { IUser } from 'src/common/interfaces';
import { ProfileDto } from 'src/profiles/dto';

@Exclude()
export class UserDto implements IUser {
  @Expose()
  id: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  email: string;
  @Expose()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
