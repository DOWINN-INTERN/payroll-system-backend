import { Exclude, Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { IOrganization } from 'src/common/interfaces';
import { UserDto } from 'src/users/dto';

@Exclude()
export class OrganizationDto implements IOrganization {
  @Expose({ toClassOnly: true })
  @Type(() => UserDto)
  creator: UserDto;

  @Expose({ toClassOnly: true })
  createdAt: Date;

  @Expose({ toClassOnly: true })
  updatedAt: Date;

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  alias: string;

  @Expose()
  invitation: string;

  @Expose()
  membersCount: number;

  @Expose({ name: 'created' })
  get created(): string {
    const created = DateTime.fromJSDate(this.createdAt).toRelative();
    return created;
  }

  @Expose({ name: 'modified' })
  get update(): string {
    const updated = DateTime.fromJSDate(this.updatedAt).toRelative();
    return updated;
  }

  @Expose({ name: 'created_at' })
  get createdDate(): string {
    const createdDate = DateTime.fromJSDate(this.createdAt).toLocaleString(
      DateTime.DATE_FULL,
    );
    return createdDate;
  }

  @Expose({ name: 'modified_at' })
  get updatedDate(): string {
    const updatedDate = DateTime.fromJSDate(this.updatedAt).toLocaleString(
      DateTime.DATE_FULL,
    );
    return updatedDate;
  }

  @Expose({ name: 'created_by' })
  get creatorUser(): string {
    return this.creator.firstName + ' ' + this.creator.lastName;
  }
}
