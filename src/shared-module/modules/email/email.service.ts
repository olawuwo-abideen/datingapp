import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  private async sendMail(options: any) {
    try {
      this.logger.log('Email sent out to', options.to);
      return await this.mailerService.sendMail(options);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new BadRequestException('Internal server error when sending email');
    }
  }

  public async sendResetPasswordLink(user: User): Promise<void> {
    try {
      console.log(user);
      const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}/${user.resetToken}`;
      const text = `Hi, \nHere is your reset password link: ${url}`;

      await this.sendMail({
        to: user.email,
        subject: 'Reset password',
        text,
      });
    } catch (error) {
      this.logger.error('Error in sendResetPasswordLink:', error);
      throw new BadRequestException('Error sending reset password link');
    }
  }
}
