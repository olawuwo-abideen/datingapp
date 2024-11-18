import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    NotFoundException,
  } from '@nestjs/common';
  import { UserService } from '../user/user.service';
  import { EntityManager, Repository } from 'typeorm';
  import { SignupDto } from '../auth/dto/sigup.dto';
  import { LoginDto } from '../auth/dto/login.dto';
  import { User, UserRole } from '../../shared-module/entities/user.entity';
  import { JwtService } from '@nestjs/jwt';
  import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
  import { ConfigService } from '@nestjs/config';
  import { ResetPasswordDto } from '../auth/dto/reset-password.dto';
  import * as bcrypt from 'bcryptjs';
  import { EmailService } from '../../shared-module/email/email.service';
  import { VerificationService } from 'src/shared-module/services/verification/verification.service';

  @Injectable()
  export class AuthService {
    constructor(
      
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    private readonly verificationService: VerificationService,
      @InjectEntityManager() private readonly entityManager: EntityManager,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,

      private readonly emailService: EmailService,
    ) {}
  
    public async signup(data: SignupDto) {
      // Hash the password
      const password: string = await this.verificationService.hash(data.password);
    
      // Create a new user entity
      let user: User = this.userRepository.create({
        firstname:data.firstname,
        lastname:data.lastname,
        age: data.age,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: password,
      });
    
      // Save the user to the database
      user = await this.userRepository.save(user);
    
      // Return the created user
      return user;
    }
    
  

  // login
  public async login({ email, password }: LoginDto) {
    const user: User | null = await this.userService.findOne({ email });

    if (
      !user ||
      !(await this.verificationService.verify(user.password, password))
    ) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return {
      token: this.createAccessToken(user),
      user: {
        ...user
      },
    };
  }
  
    public createAccessToken(user: User): string {
      return this.jwtService.sign({ sub: user.id });
    }
  
    async forgotPassword(email: string): Promise<void> {
      const user: User | null = await this.userService.findOne({ email });
  
      if (!user) {
        throw new NotFoundException(`Email does not exist in our record.`);
      }
  
      const payload = { email: user.email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: `${this.configService.get('JWT_RESET_PASSWORD_EXPIRATION_TIME')}`,
      });
  
      user.resetToken = token;
  
      await this.userRepository.update(
        {
          id: user.id,
        },
        {
          resetToken: token,
        },
      );
  
      await this.emailService.sendResetPasswordLink(user);
    }
  
    public async decodeConfirmationToken(token: string) {
      try {
        const payload = await this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET'),
        });
  
        return payload?.email;
      } catch (error) {
        if (error?.name === 'TokenExpiredError') {
          throw new BadRequestException('Reset password link expired.');
        }
        throw new BadRequestException('Reset password link expired.');
      }
    }
  
    async resetPassword(payload: ResetPasswordDto): Promise<void> {
      const email = await this.decodeConfirmationToken(payload.token);
  
      const user: User | null = await this.userService.findOne({
        email,
        resetToken: payload.token,
      });
  
      if (!user) {
        throw new BadRequestException(`Reset token expired. please try again.`);
      }
  
      const password = await bcrypt.hash(payload.password, 10);
  
      await this.userRepository.update(
        { id: user.id },
        { password, resetToken: null },
      );
    }
  }
  