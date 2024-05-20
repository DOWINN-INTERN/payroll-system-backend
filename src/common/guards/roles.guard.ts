import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types';
import { Organization } from 'src/organizations/entities';
import { ParamsDictionary } from 'express-serve-static-core';

interface IParams extends ParamsDictionary {
  organization: string;
}

interface IRequest extends Request {
  params: IParams;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Member) private membersRepository: Repository<Member>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user, params } = context.switchToHttp().getRequest<IRequest>();
    const { sub } = user as JwtPayload;
    const organization = params.organization;

    if (!organization) throw new ForbiddenException();
    const isOrgExist = await this.organizationRepository.findOne({
      where: { alias: organization },
    });

    if (!isOrgExist) throw new NotFoundException();
    const member = await this.membersRepository.findOne({
      relations: { role: true },
      where: { organization: { alias: organization }, user: { id: sub } },
    });

    if (!member) throw new ForbiddenException();

    return requiredRoles.some((role) => member.role.name === role);
  }
}
