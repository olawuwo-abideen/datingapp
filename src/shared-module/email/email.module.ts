import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/app/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared-module/entities/user.entity';

@Module({
  imports: [JwtModule,ConfigModule,UserModule,
    TypeOrmModule.forFeature([User]),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USERNAME'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"True Love Dating App" <${config.get('MAIL_USERNAME')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
            inlineCssOptions: {
              inlineStyleTags: true,
              keepStyleTags: true,
              keepLinkTags: true,
              loadRemoteStylesheets: true,
            },
          }),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],

  exports: [EmailService],
})
export class EmailModule {}
