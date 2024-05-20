import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { nanoid } from 'nanoid';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { User } from 'src/users/entities';
import { Profile } from 'src/profiles/entities';
import { CreateUserDto } from 'src/users/dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async googleOAuth(user: any) {
    if (!user) throw new UnauthorizedException();
    const userExists = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (!userExists) {
      const profile = await this.profilesRepository.save({
        firstName: user.firstName,
        lastName: user.lastName,
      });
      const newUser = await this.usersRepository.save({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: profile,
      });
      const tokens = await this.getTokens(newUser.id, newUser.email);
      await this.updateRefreshToken(newUser.id, tokens.refresh_token);
      return tokens;
    } else {
      const tokens = await this.getTokens(userExists.id, userExists.email);
      await this.updateRefreshToken(userExists.id, tokens.refresh_token);
      return tokens;
    }
  }
  async facebookAuth(user: any) {
    if (!user) throw new UnauthorizedException();
    const userExists = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (!userExists) {
      const profile = await this.profilesRepository.save({
        firstName: user.firstName,
        lastName: user.lastName,
      });
      const newUser = await this.usersRepository.save({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profile: profile,
      });
      const tokens = await this.getTokens(newUser.id, newUser.email);
      await this.updateRefreshToken(newUser.id, tokens.refresh_token);
      return tokens;
    } else {
      const tokens = await this.getTokens(userExists.id, userExists.email);
      await this.updateRefreshToken(userExists.id, tokens.refresh_token);
      return tokens;
    }
  }

  async signUp(body: CreateUserDto): Promise<Tokens> {
    const { email, password, firstName, lastName } = body;
    const userExists = await this.usersRepository.findOneBy({ email: email });
    if (userExists) throw new ConflictException();
    const profile = await this.profilesRepository.save({
      firstName: firstName,
      lastName: lastName,
    });
    const username = nanoid();
    //const username = generateFromEmail(email);

    const passwordHashed = await argon.hash(password);
    const user = await this.usersRepository.save({
      ...body,
      username: username,
      password: passwordHashed,
      profile: profile,
    });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async signIn(payload: AuthDto): Promise<Tokens> {
    const { email, password } = payload;
    const user = await this.usersRepository.findOneBy({ email: email });
    if (!user) throw new NotFoundException('User does not exist');
    const passwordMatches = await argon.verify(user.password, password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid password');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async signOut(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      refreshToken: null,
    });
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const refreshTokenHashed = await argon.hash(refreshToken);
    await this.usersRepository.update(id, {
      refreshToken: refreshTokenHashed,
    });
  }

  async getTokens(id: string, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: id, email },
        { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '10m' },
      ),
      this.jwtService.signAsync(
        { sub: id, email },
        { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
      ),
    ]);
    return { access_token, refresh_token };
  }

  async refreshTokens(id: string, refresh_token: string): Promise<Tokens> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) throw new UnauthorizedException();
    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refresh_token,
    );
    if (!refreshTokenMatches) throw new UnauthorizedException();

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
}
