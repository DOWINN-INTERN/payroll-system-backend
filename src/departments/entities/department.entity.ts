import { Branch } from 'src/branches/entities/branch.entity';
import { Role } from 'src/iam/entities';
import { Member } from 'src/members/entities/member.entity';
import { Organization } from 'src/organizations/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  alias: string;

  @ManyToOne(() => Organization, (organization) => organization.departments)
  organization: Organization;

  @ManyToOne(() => Branch, (branch) => branch.departments)
  branch: Branch;

  @OneToMany(() => Member, (member) => member.department)
  members: Member[];

  @OneToMany(() => Role, (role) => role.department)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
