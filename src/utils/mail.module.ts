import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          service: config.get('EMAIL_PROVIDER'),
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASSWORD'),
          },
          secure: config.get('EMAIL_SECURE'),
        },
        defaults: {
          from: config.get('EMAIL_FROM'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}