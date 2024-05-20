import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { Tokens } from 'src/auth/types';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((tokens: Tokens) => {
        // response.cookie('Refresh-Token', tokens.refresh_token, {
        //   httpOnly: true,
        // });
        response.set({
          'Access-Token': tokens.access_token,
          'Refresh-Token': tokens.refresh_token,
        });
        response.json({});
      }),
    );
  }
}
