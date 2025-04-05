import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCompany } from '../../entities/user-company.entity';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(UserCompany)
    private readonly userCompanyRepo: Repository<UserCompany>,
  ) {}
}
