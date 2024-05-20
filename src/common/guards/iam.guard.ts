import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types';
import { ParamsDictionary } from 'express-serve-static-core';
import { Reflector } from '@nestjs/core';
import { Member } from 'src/members/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../enums';
import {
  IPermission,
  PERMISSION_KEY,
} from '../decorators/permissions.decorator';

interface IParams extends ParamsDictionary {
  organization: string;
}

interface IRequest extends Request {
  params: IParams;
}

@Injectable()
export class IamGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Member) private membersRepository: Repository<Member>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<IPermission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest<IRequest>();
    const user = request.user as JwtPayload;
    const organization = request.params.organization;

    if (!organization) throw new ForbiddenException();
    const member = await this.membersRepository.findOne({
      relations: { role: { permissions: true } },
      where: {
        organization: { alias: organization },
        user: { id: user.sub },
      },
    });
    if (!member.role) throw new PreconditionFailedException();
    if (member.role.name === Role.Owner) return true;

    const permissionsMatches = requiredPermissions.some((permission) =>
      member.role.permissions.some(
        (memberPermission) =>
          permission.action === memberPermission.action &&
          permission.subject === memberPermission.subject,
      ),
    );
    if (permissionsMatches) return true;
    throw new PreconditionFailedException();
  }
}
