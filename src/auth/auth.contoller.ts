/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.gurad';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-company')
  async checkCompany(@Body('name') name: string) {
    const exists = await this.authService.checkCompany(name);
    return { exists };
  }

  @Post('register-company')
  async registerCompany(@Body('name') name: string) {
    console.log(name);
    const company = await this.authService.createCompany(name);
    return { id: company.id, name: company.name };
  }

  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('companyId') companyId: string,
  ) {
    const { token, userId } = await this.authService.signup(
      email,
      password,
      name,
      companyId,
    );
    return { id: userId, email, name, companyId, token };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const { token, userId } = await this.authService.login(email, password);
    return { email, password, token, userId };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@GetUser() user: User) {
    const userId = user.id;
    const profile = await this.authService.me(userId);
    return profile;
  }
}
