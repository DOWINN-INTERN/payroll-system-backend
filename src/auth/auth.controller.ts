import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public, User, UserId } from 'src/common/decorators';
import {
  FacebookAuthGuard,
  GoogleOAuthGuard,
  RefreshTokenHeaderGuard,
} from 'src/common/guards';
import { AuthDto } from './dto';
import { AuthInterceptor } from 'src/common/interceptors';
import { CreateUserDto } from 'src/users/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleOAuth() {}

  @Public()
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {}

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() request: Request, @Res() response: Response) {
    const user = request.user;
    const tokens = await this.authService.googleOAuth(user);
    response.set({
      'Access-Token': tokens.access_token,
      'Refresh-Token': tokens.refresh_token,
    });
    response.redirect(
      `http://10.10.10.149:5173/login?at=${tokens.access_token}&rf=${tokens.refresh_token}`,
    );
  }

  @Public()
  @Post('signup')
  @UseInterceptors(AuthInterceptor)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('signin')
  @UseInterceptors(AuthInterceptor)
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Post('signout')
  signout(@Req() request: Request, @Res() response: Response) {
    this.authService.signOut(request.user['sub']);
    // response
    //   .clearCookie('Refresh-Token')
    //   .status(200)
    //   .json({ message: 'logout' });
    // request.logOut((err) => {
    //   if (err) this.logger.error(err);
    //   this.logger.debug('done');
    // });
    response.json({});
  }

  @Public()
  @UseGuards(RefreshTokenHeaderGuard)
  @Post('refresh')
  @UseInterceptors(AuthInterceptor)
  refreshToken(
    @UserId() userId: string,
    @User('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
