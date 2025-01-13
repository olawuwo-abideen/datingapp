import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../shared-module/services/typeorm/typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ReportModule } from './report/report.module';



=======
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { PreferenceModule } from './preference/preference.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { MatchModule } from './match/match.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/shared-module/services/typeorm/typeorm-config.service';
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
<<<<<<< HEAD
    AuthModule,
    UserModule,
    AdminModule,
    ReportModule,
   

  ],
  controllers: [],
  providers: [],
  exports: [],
=======
    AdminModule, 
    AuthModule, 
    ReportModule, 
    UserModule, 
    PreferenceModule, 
    PaymentModule, 
    NotificationModule, 
    MessageModule, 
    MatchModule],
  controllers: [AppController],
  providers: [AppService],
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
})
export class AppModule {}