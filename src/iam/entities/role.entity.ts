import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Member } from 'src/members/entities';
import { Organization } from 'src/organizations/entities';
import { Branch } from 'src/branches/entities';
import { Department } from 'src/departments/entities';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];

  @OneToOne(() => Member, (member) => member.role)
  member: Member;

  @ManyToOne(() => Organization, (organization) => organization.roles)
  organization: Organization;

  @ManyToOne(() => Branch, (branch) => branch.roles)
  branch: Branch;

  @ManyToOne(() => Department, (department) => department)
  department: Department;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
