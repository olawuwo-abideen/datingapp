import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.nodemailerTransport = createTransport({
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      secure: true,
      auth: {
        user: configService.get('MAIL_FROM_ADDRESS'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    });
  }

  private sendMail(options: Mail.Options) {
    this.logger.log('Email sent out to', options.to);
    return this.nodemailerTransport.sendMail(options);
  }

  public async sendResetPasswordLink(user: User): Promise<void> {
    try {
      console.log(user);
      const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}/${user.resetToken}`;

      const text = `Hi, \nHere is your reset password link: ${url}`;

      await this.sendMail({
        from: this.configService.get('MAIL_FROM_ADDRESS'),
        to: user.email,
        subject: 'Reset password',
        text,
      });
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException('Internal server errors');
    }
  }




}
