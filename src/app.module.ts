import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { OrganizationsModule } from './organizations/organizations.module';
import { BranchesModule } from './branches/branches.module';
import { DepartmentsModule } from './departments/departments.module';
import { AccessTokenGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';
import { MembersModule } from './members/members.module';
import { ProfilesModule } from './profiles/profiles.module';
import { OrmConfigService } from './db/ormconfig.service';
import { AppRoutes } from './app.routes';
import { IamModule } from './iam/iam.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: OrmConfigService,
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    BranchesModule,
    DepartmentsModule,
    MembersModule,
    ProfilesModule,
    AppRoutes,
    IamModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
