import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

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
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  'facebook-auth',
) {
  private readonly logger = new Logger(FacebookStrategy.name);

  constructor() {
    super({
      clientID: process.env.FACEBOOK_AUTH_CLIENTID,
      clientSecret: process.env.FACEBOOK_AUTH_CLIENTSECRET,
      callbackURL: process.env.FACEBOOK_AUTH_CALLBACKURL,
      scope: ['profile', 'email'],
      prompt: 'select_account',
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: IProfile,
    done: (err: any, user: any, info?: any) => void,
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
