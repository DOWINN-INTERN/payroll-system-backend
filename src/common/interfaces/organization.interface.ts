import { IUser } from './user.interface';

export interface IOrganization {
  id: string;
  name: string;
  alias: string;
  invitation: string;
  membersCount: number;
  creator: IUser;
  createdAt: Date;
}
