/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-company')
  async checkCompany(@Body('name') name: string) {
    const exists = await this.authService.checkCompany(name);
    // return { exists };
    return {
      exists: exists,
      success: true,
      message: exists ? 'Congratulations!' : 'Compnay With same name Exists',
    };
  }

  @Post('register-company')
  async registerCompany(@Body('name') name: string) {
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return this.authService.getMe(req.user.userId); // `userId` should come from JWT payload
  }
}
