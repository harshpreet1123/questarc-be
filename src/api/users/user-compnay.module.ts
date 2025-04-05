// user-company.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCompanyService } from './user-compnay.service';
import { UserCompany } from '../../entities/user-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompany])],
  providers: [UserCompanyService],
  exports: [UserCompanyService],
})
export class UserCompanyModule {}
