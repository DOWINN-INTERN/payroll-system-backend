import { IProfile } from './profile.interface';

export interface IUser {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  password?: string;

  username?: string;

  refreshToken?: string;

  profile?: IProfile;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
