import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenHeaderGuard extends AuthGuard('jwt-refresh-header') {
  constructor() {
    super();
  }
}
