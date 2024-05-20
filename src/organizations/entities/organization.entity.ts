import { Branch } from 'src/branches/entities/branch.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Role } from 'src/iam/entities';
import { Member } from 'src/members/entities/member.entity';
import { User } from 'src/users/entities/user.entity';
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
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  alias: string;

  @Column()
  invitation: string;

  @ManyToOne(() => User, (user) => user.organizations)
  creator: User;

  @OneToMany(() => Branch, (branch) => branch.organization)
  branches: Branch[];

  @OneToMany(() => Department, (department) => department.organization)
  departments: Department[];

  @OneToMany(() => Member, (member) => member.organization)
  members: Member[];

  @OneToMany(() => Role, (role) => role.organization)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
