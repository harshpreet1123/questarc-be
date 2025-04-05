import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';
import { UserCompany } from '../../entities/user-company.entity';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from 'src/utils/mail.module';
import { UserCompanyModule } from './user-compnay.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, UserCompany]),
    AuthModule,
    MailModule,
    UserCompanyModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecretkey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
