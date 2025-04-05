import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserCompany } from './user-company.entity';

@Entity() // ✅ Ensure the @Entity decorator is present
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true }) // 👈 Ensure nullable: false
  name: string;

  @OneToMany(() => UserCompany, (uc) => uc.company)
  userCompanies: UserCompany[];
}
