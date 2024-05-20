import { Department } from 'src/departments/entities/department.entity';
import { Role } from 'src/iam/entities';
import { Member } from 'src/members/entities/member.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  branch_alias: string;

  @ManyToOne(() => Organization, (org) => org.branches)
  @JoinColumn([
    {
      name: 'organization_alias',
      referencedColumnName: 'alias',
    },
    {
      name: 'organization_id',
      referencedColumnName: 'id',
    },
  ])
  organization: Organization;

  @OneToMany(() => Department, (department) => department.branch)
  departments: Department[];

  @OneToMany(() => Member, (member) => member.branch)
  members: Member[];

  @OneToMany(() => Role, (role) => role.branch)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
