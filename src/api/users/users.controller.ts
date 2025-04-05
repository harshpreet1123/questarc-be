/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, UseGuards, Post, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from 'src/decorators/permissions.decorator';
import { JwtAuthGuard } from 'src/api/auth/jwt-auth.guard';
import { Permission } from 'src/enums/permissions.enum';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    console.log(req);
    return this.usersService.getMe(req.user.userId);
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.ADD_USER)
  inviteUser(
    @Body('email') email: string,
    @Body('companyId') companyId: string,
    @Req() req,
  ) {
    console.log(req.user);
    return this.usersService.inviteUser(email, companyId, req.user.userId);
  }

  // Add more user-related routes as needed
}
