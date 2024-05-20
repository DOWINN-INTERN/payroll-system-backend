import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types';

@Injectable()
export class RefreshTokenHeaderStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-header',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = request
      .get('Authorization')
      .replace('Bearer', '')
      .trim();
    if (!refreshToken) throw new UnauthorizedException();
    return { ...payload, refreshToken };
  }
}
