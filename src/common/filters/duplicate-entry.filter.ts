import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class DuplicateEntryFilter implements ExceptionFilter {
  private readonly logger = new Logger(DuplicateEntryFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    //this.logger.log('⚠ ' + exception.query);
    //this.logger.log('⚠ ' + exception.parameters);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const { code } = exception as any;
    const { name, message } = exception;
    const error = {
      code: code,
      name: name,
      message: message,
      statusCode: 409,
      timestamp: new Date().toISOString(),
    };

    response.status(HttpStatus.CONFLICT).json(error);
  }
}
