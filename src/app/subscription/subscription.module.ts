import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared-module/entities/user.entity';
import { Plan } from 'src/shared-module/entities/plan.entity';
import { Subscription } from 'src/shared-module/entities/subscription.entity';
import { Payment } from 'src/shared-module/entities/payment.entity';
import { StripeModule } from 'src/shared-module/modules/stripe/stripe.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, Plan, Subscription, Payment]),
      StripeModule
    ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService]
})
export class SubscriptionModule {}
