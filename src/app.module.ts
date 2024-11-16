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

@Module({
  imports: [AdminModule, AuthModule, ReportModule, UserModule, PreferenceModule, PaymentModule, NotificationModule, MessageModule, MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
