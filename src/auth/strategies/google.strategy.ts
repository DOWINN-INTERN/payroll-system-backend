import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

interface IProfile {
  provider: string;
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
    middleName: string;
  };
  emails: {
    value: string;
    type: string;
  }[];
  photos: {
    value: string;
  }[];
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-auth') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENTID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENTSECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACKURL,
      scope: ['profile', 'email'],
      prompt: 'select_account',
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: IProfile,
    done: VerifyCallback,
  ) {
    this.logger.debug(profile);
    const user = {
      provider: 'google',
      providerId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      picture: profile.photos[0].value,
    };
    done(null, user);
  }
}
