import { SetMetadata } from '@nestjs/common';

export interface IPermission {
  subject: string;
  action: string;
}
export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permissions: IPermission[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
