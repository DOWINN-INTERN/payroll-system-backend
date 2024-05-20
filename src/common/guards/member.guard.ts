import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { OrganizationRequest } from './organization.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from 'src/members/entities';
import { MembershipStatus } from '../enums';
import { JwtPayload } from 'src/auth/types';

@Injectable()
export class MemberGuard implements CanActivate {
  protected readonly logger = new Logger();

  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<OrganizationRequest>();
    const user = request.user as JwtPayload;
    const { organization } = request.params;
    const member = await this.membersRepository.exists({
      where: {
        user: { id: user.sub },
        organization: { alias: organization },
        membership: MembershipStatus.ACCEPTED,
      },
    });
    if (!member) throw new ForbiddenException();
    return true;
  }
}
