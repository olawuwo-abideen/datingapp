import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../../../shared-module/decorators/public.decorator';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/reset-password.dto';
import { Request } from 'express';

@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() data: SignupDto) {
    return await this.authService.signup(data);
  }

  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto){
    await this.authService.resetPassword(payload);
  }


  @Post('logout')
  async logout(@Req() request: Request) {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Authorization token is required');
    }
    await this.authService.logout(token);
  }
  

}
