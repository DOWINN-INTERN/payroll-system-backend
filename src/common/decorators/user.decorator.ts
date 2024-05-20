import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadWithRefreshToken } from 'src/auth/types';

export const User = createParamDecorator(
  (
    data: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
