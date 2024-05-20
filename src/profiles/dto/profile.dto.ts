import { Exclude, Expose } from 'class-transformer';
import { IProfile } from 'src/common/interfaces';

@Exclude()
export class ProfileDto implements IProfile {
  @Expose()
  id: number;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  middleName: string;

  @Expose()
  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }
}
