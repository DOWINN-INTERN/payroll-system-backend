import { Exclude, Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { MembershipStatus } from 'src/common/enums/membership-status.enum';
import { IMember } from 'src/common/interfaces';
import { OrganizationDto } from 'src/organizations/dto';
import { UserDto } from 'src/users/dto';

@Exclude()
export class MemberDto implements IMember {
  @Expose({ toClassOnly: true })
  @Type(() => UserDto)
  user: UserDto;

  @Expose({ toClassOnly: true })
  createdAt: Date;

  @Expose()
  id: number;

  @Expose({ name: 'name' })
  get fullName(): string {
    return this.user.profile.firstName + ' ' + this.user.profile.lastName;
  }

  @Expose({ name: 'email' })
  get userCredentials(): string {
    return this.user.email;
  }

  @Expose()
  membership: MembershipStatus;

  @Expose()
  role: string;

  @Expose()
  joined: boolean;

  @Expose({ name: 'join' })
  get join(): string {
    const join = DateTime.fromJSDate(this.createdAt).toRelative();
    return join;
  }

  @Expose({ name: 'join_date' })
  get joinDate(): string {
    const joinDate = DateTime.fromJSDate(this.createdAt).toLocaleString(
      DateTime.DATETIME_FULL,
    );
    return joinDate;
  }

  @Expose({ toClassOnly: true })
  @Type(() => OrganizationDto)
  organization: OrganizationDto;

  @Expose({ name: 'organization_name' })
  get organizationName(): string {
    return this.organization.name;
  }
}
