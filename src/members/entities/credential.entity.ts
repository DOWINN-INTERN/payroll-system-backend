import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  suffix: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  civilStatus: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 14,
    scale: 2,
  })
  salary: number;

  @OneToOne(() => Member, (member) => member.credential)
  member: Member;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
