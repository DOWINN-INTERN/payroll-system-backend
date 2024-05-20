import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DuplicateEntryFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://10.10.10.149:5173',
      'http://10.10.10.98:5174',
      'http://10.10.10.98:5173',
    ],
    exposedHeaders: 'Access-Token,Refresh-Token',
  });
  app.use(cookieParser());
  app.useGlobalFilters(new DuplicateEntryFilter());
  await app.listen(+process.env.PORT);
}
bootstrap();
