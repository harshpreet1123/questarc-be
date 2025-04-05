/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';
import { UserCompany } from '../../entities/user-company.entity';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  logger: any;
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(UserCompany)
    private userCompanyRepo: Repository<UserCompany>,
    private readonly mailerService: MailerService,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'userCompanies',
        'userCompanies.company',
        'userCompanies.permissions',
      ],
    });

    if (!user) throw new BadRequestException('User not found');

    const companies = user.userCompanies.map((uc) => ({
      companyId: uc.company.id,
      companyName: uc.company.name,
      role: uc.role,
      designatedRole: uc.designatedRole,
    }));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      companies,
    };
  }

  async inviteUser(email: string, companyId: string, inviterId: string) {
    // Validate company and inviter
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });
    const inviter = await this.userRepo.findOne({ where: { id: inviterId } });

    if (!company) throw new BadRequestException('Company not found');
    if (!inviter) throw new BadRequestException('Inviter not found');

    // Check if user exists
    let user = await this.userRepo.findOne({ where: { email } });
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // If user doesn't exist, create new one
    if (!user) {
      user = this.userRepo.create({
        email,
        password: hashedPassword,
        name: email.split('@')[0],
      });
      await this.userRepo.save(user);
    }

    // Check if user is already in company
    const existingUserCompany = await this.userCompanyRepo.findOne({
      where: {
        user: { id: user.id },
        company: { id: company.id },
      },
    });

    if (existingUserCompany) {
      throw new BadRequestException('User already in company');
    }

    // Add user to company
    const userCompany = this.userCompanyRepo.create({
      user,
      company,
      role: 'member',
      designatedRole: 'Member',
      invitedBy: inviter,
    });

    // Assign basic permissions
    // const basicPermissions = await this.permissionRepo.find({
    //   where: [
    //     { name: PermissionType.ADD_PROJECT },
    //     { name: PermissionType.EDIT_PROJECT },
    //   ],
    // });

    // userCompany.permissions = basicPermissions;
    await this.userCompanyRepo.save(userCompany);

    // Send invitation email
    await this.sendInvitationEmail(
      email,
      tempPassword,
      company.name,
      inviter.name,
    );

    return {
      success: true,
      message: 'Invitation sent successfully',
      userId: user.id,
      email,
      tempPassword: user.password === hashedPassword ? tempPassword : undefined,
    };
  }

  private async sendInvitationEmail(
    email: string,
    tempPassword: string,
    companyName: string,
    inviterName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `You've been invited to join ${companyName} on QuestArc`,
        html: this.getInvitationEmailTemplate(
          email,
          tempPassword,
          companyName,
          inviterName,
        ),
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error.stack);
      throw new Error('Failed to send invitation email');
    }
  }

  private getInvitationEmailTemplate(
    email: string,
    tempPassword: string,
    companyName: string,
    inviterName: string,
  ): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a6baf; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { 
          display: inline-block; 
          padding: 10px 20px; 
          background-color: #4a6baf; 
          color: white !important; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 15px 0;
        }
        .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #777; }
        .password { 
          background-color: #f0f0f0; 
          padding: 10px; 
          border-radius: 5px; 
          font-family: monospace;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to QuestArc</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You've been invited by ${inviterName} to join <strong>${companyName}</strong> on QuestArc - the project management platform.</p>
          
          <p>Here are your temporary login credentials:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> <span class="password">${tempPassword}</span></p>
          
          <p>To get started:</p>
          <ol>
            <li>Log in to QuestArc at <a href="${process.env.APP_URL}">${process.env.APP_URL}</a></li>
            <li>Go to your profile settings</li>
            <li>Change your password immediately</li>
          </ol>
          
          <a href="${process.env.APP_URL}" class="button">Go to QuestArc</a>
          
          <p>If you didn't request this invitation, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} QuestArc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
