import { Module } from '@nestjs/common';
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
})
export class AppModule {}