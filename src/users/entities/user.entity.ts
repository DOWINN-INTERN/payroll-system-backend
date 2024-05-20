import { Member } from 'src/members/entities/member.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Organization, (organization) => organization.creator)
  organizations: Organization[];

  @OneToMany(() => Member, (member) => member.user)
  memberships: Member[];

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
