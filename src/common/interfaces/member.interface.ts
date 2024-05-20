import { MembershipStatus } from '../enums';
import { IOrganization } from './organization.interface';
import { IUser } from './user.interface';

export interface IMember {
  id: number;
  membership: MembershipStatus;
  joined: boolean;
  createdAt: Date;
  user: IUser;
  organization: IOrganization;
  role: string;
}
