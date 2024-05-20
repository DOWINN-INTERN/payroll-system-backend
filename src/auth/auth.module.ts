import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AccessTokenStrategy,
  FacebookStrategy,
  GoogleStrategy,
  RefreshTokenHeaderStrategy,
} from './strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profiles/entities';
import { User } from 'src/users/entities';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenHeaderStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
