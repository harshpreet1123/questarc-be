import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.contoller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserCompany } from 'src/entities/user-company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company, UserCompany]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecretkey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
