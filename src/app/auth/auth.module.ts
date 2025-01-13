import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
=======
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { User } from '../../shared-module/entities/user.entity';
import { CloudinaryModule } from '../../shared-module/cloudinary/cloudinary.module';
<<<<<<< HEAD
import { EmailModule } from '../../shared-module/modules/email/email.module';
=======
import { EmailModule } from '../../shared-module/email/email.module';
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION_TIME')}`,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      User
    ]),
    CloudinaryModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AuthModule {}
