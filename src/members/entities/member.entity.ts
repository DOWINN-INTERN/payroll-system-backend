import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Credential } from './credential.entity';
import { MembershipStatus } from 'src/common/enums';
import { Branch } from 'src/branches/entities/branch.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Role } from 'src/iam/entities';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ default: false })
  // joined: boolean;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.PENDING,
  })
  membership: MembershipStatus;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.members)
  organization: Organization;

  @ManyToOne(() => Branch, (branch) => branch.members)
  branch: Branch;

  @ManyToOne(() => Department, (department) => department)
  department: Department;

  // @Column({ default: 'member' })
  // role: string;

  @OneToOne(() => Role, (role) => role.member)
  @JoinColumn()
  role: Role;

  @OneToOne(() => Credential, (credential) => credential.member)
  @JoinColumn()
  credential: Credential;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
