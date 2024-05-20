import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request.cookies['Refresh-Token'];
          if (!data) throw new ForbiddenException();
          return data;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.cookies['Refresh-Token'];
    if (!refreshToken) throw new UnauthorizedException();
    return { ...payload, refreshToken };
  }
}
