import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../auth/dto/sigup.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../auth/dto/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}


    @Post('signup')
    async signup(@Body() data: SignupDto) {
      return await this.authService.signup(data);
    }
  
    @Post('login')
    async login(@Body() user: LoginDto) {
      return this.authService.login(user);
    }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(payload);
  }



  @Post('logout')
async logout(@Body('token') token: string): Promise<void> {
  await this.authService.logout(token);
}

}













