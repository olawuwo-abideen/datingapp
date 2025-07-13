import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared-module/entities/user.entity';
import { Plan } from '../../shared-module/entities/plan.entity';
import { Subscription } from '../../shared-module/entities/subscription.entity';
import { Payment } from '../../shared-module/entities/payment.entity';
import { StripeModule } from '../../shared-module/modules/stripe/stripe.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, Plan, Subscription, Payment]),
      StripeModule
    ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService]
})
export class SubscriptionModule {}
