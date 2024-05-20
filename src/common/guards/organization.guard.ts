import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities';
import { Repository } from 'typeorm';

interface OrganizationParams extends ParamsDictionary {
  organization: string;
}

export interface OrganizationRequest extends Request {
  params: OrganizationParams;
}

@Injectable()
export class OrganizationGuard implements CanActivate {
  protected readonly logger = new Logger();
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<OrganizationRequest>();
    const { organization } = request.params;
    if (!organization) return true;
    const organizationExist = await this.organizationsRepository.existsBy({
      alias: organization,
    });
    if (!organizationExist) throw new NotFoundException();
    return true;
  }
}
