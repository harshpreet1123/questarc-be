import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity() // ✅ Ensure the @Entity decorator is present
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true }) // 👈 Ensure nullable: false
  name: string;

  @OneToMany(() => User, (user) => user.company, { cascade: true })
  users: User[];
}
