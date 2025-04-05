import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';
import { Permission } from 'src/enums/permissions.enum';

export type UserRole = 'admin' | 'member' | 'guest';

@Entity()
export class UserCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userCompanies)
  user: User;

  @ManyToOne(() => Company, company => company.userCompanies, { onDelete: 'CASCADE' }) // Remove `cascade: true`
  company: Company;
  

  @Column({ type: 'text' })
  designatedRole: string;

  @Column({ type: 'text' })
  role: UserRole;

  @ManyToOne(() => User, { nullable: true })
  invitedBy: User;

  @Column("text", { array: true, default: [] })
  permissions: Permission[];

  @CreateDateColumn()
  joinedAt: Date;
}
