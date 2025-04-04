import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    private jwtService: JwtService,
  ) {}

  async checkCompany(name: string): Promise<boolean> {
    const company = await this.companyRepo.findOne({ where: { name } });
    return !!company;
  }

  async createCompany(name: string): Promise<Company> {
    const exists = await this.companyRepo.findOne({ where: { name } });
    if (exists) throw new BadRequestException('Company already exists');

    const company = this.companyRepo.create({ name });
    return this.companyRepo.save(company);
  }

  async signup(
    email: string,
    password: string,
    name: string,
    companyId: string,
  ): Promise<{ token: string; userId: string }> {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) throw new BadRequestException('User already exists');

    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });
    if (!company) throw new BadRequestException('Invalid company');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      company,
    });
    await this.userRepo.save(user);

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return { token, userId: user.id };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; userId: string }> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['company'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { token, userId: user.id };
  }

  async me(userId: string): Promise<{
    id: string;
    email: string;
    name: string;
    company: { id: string; name: string };
  }> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['company'],
    });
  
    if (!user) throw new UnauthorizedException('User not found');
  
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      company: {
        id: user.company.id,
        name: user.company.name,
      },
    };
  }
  
}
