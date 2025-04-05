import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserCompany } from './user-company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 1 })
  level: number;

  @OneToMany(() => UserCompany, (uc) => uc.user)
  userCompanies: UserCompany[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
