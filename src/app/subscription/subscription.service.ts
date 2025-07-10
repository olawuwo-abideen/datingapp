import {
  BadRequestException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { Plan } from '../../shared-module/entities/plan.entity';
import {Subscription,SubscriptionStatusEnum} from '../../shared-module/entities/subscription.entity';
import { User } from '../../shared-module/entities/user.entity';
import { Payment } from '../../shared-module/entities/payment.entity';
import { RenewSubscriptionDto } from './dto/subscription.dto';
import { generateUniqueReference } from '../../shared-module/utils/helpers.util';
import { isString } from 'class-validator';
import { StripeService } from 'src/shared-module/modules/stripe/stripe.service';

@Injectable()
export class SubscriptionService implements OnModuleInit {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly stripeService: StripeService
  ) {}

  async onModuleInit() {
    const plans: Partial<Plan>[] = [
  {
    name: 'Free Plan (Basic Access)',
    description: 'Great for users exploring the platform at no cost.',
    features: [
      'Limited daily matches',
      'View profiles and send likes',
      'Access to basic chat features with matched users',
      'Ads displayed occasionally',
    ],
    amount: 0,
    duration: 'unlimited',
  },
  {
    name: 'Premium Plan (Unlimited Dating)',
    description: 'Unlock all core features for an uninterrupted dating experience.',
    features: [
      'Unlimited swipes and matches',
      'Rewind last swipe',
      'See who liked your profile',
      'Boost profile once a week',
      'Advanced search filters (distance, interests, etc.)',
      'Ad-free experience',
    ],
    amount: 14.99,
    duration: '1', 
  },
  {
    name: 'Elite Plan (Dating Pro)',
    description: 'Perfect for power users who want full control and visibility.',
    features: [
      'All Premium features included',
      'Unlimited profile boosts',
      'Access to exclusive top picks',
      'Incognito mode (browse profiles without being seen)',
      'Priority support',
      'Verified badge eligibility',
    ],
    amount: 24.99,
    duration: '1', 
  },
  {
    name: 'Couples Plan',
    description: 'Ideal for couples looking for friends or poly relationships.',
    features: [
      'Linked profiles with shared bio and photos',
      'Advanced visibility controls',
      'Access to couples-only match filters',
      'All Premium features included',
    ],
    amount: 19.99,
    duration: '1',
  }
]
    for (let i = 0; i <= plans.length - 1; i++) {
      const getPlan = await this.planRepository.findOne({
        where: { name: plans[i].name },
      });

      if (!getPlan) {
        await this.planRepository.save(plans[i]);
      }
    }
  }

  async createPlan(createPlanDto: any): Promise<Plan> {
    return await this.planRepository.save(createPlanDto);
  }

  async getPlans(user: User): Promise<Plan[]> {
    const where: FindOptionsWhere<Plan> = {};

    const validateFreeplan = await this.subscriptionRepository.count({
      where: { userId: user.id },
    });
    if (validateFreeplan) {
      where.amount = MoreThan(0);
    }
    return await this.planRepository.find({ where });
  }


  async getCurrentSubscription(
    user: User | string,
  ): Promise<Subscription | null> {
    const userId = !isString(user) ? user.id : user;

    return await this.subscriptionRepository.findOne({
      where: { userId },
      relations: ['plan'],
    });
  }

 
async renewSubscription(data: RenewSubscriptionDto, user: User) {
  // Fetch the plan
  const plan = await this.planRepository.findOne({ where: { id: data.planId } });
  if (!plan) {
    throw new BadRequestException('Invalid subscription plan. Please contact support.');
  }

  // Require payment reference for non-free plans
  if (!plan.isFree && !data.reference) {
    throw new BadRequestException('Payment reference is required.');
  }

  // Prevent duplicate payment references
  if (data.reference) {
    const existingPayment = await this.paymentRepository.findOne({ where: { reference: data.reference } });
    if (existingPayment) {
      throw new BadRequestException('This payment reference has already been used.');
    }
  }

  // Disallow free plan renewal if user already has a subscription
  if (plan.isFree) {
    const previousSubs = await this.subscriptionRepository.count({ where: { userId: user.id } });
    if (previousSubs > 0) {
      throw new BadRequestException('You cannot renew a free plan.');
    }
  }

  // Verify payment if not free
  let paymentStatus = 'success';
  let amountPaid = plan.amount;

  if (!plan.isFree) {
    const verify = await this.stripeService.verifyPayment(data.reference);

    if (!verify || verify.status !== 'Paid') {
      throw new BadRequestException('Payment verification failed. Please contact support.');
    }

    if (parseFloat(verify.amount) !== parseFloat(amountPaid.toString())) {
      throw new BadRequestException('Amount paid does not match plan cost. Please contact support.');
    }
  }

  // Deactivate active subscriptions
  await this.subscriptionRepository.update(
    { userId: user.id, status: SubscriptionStatusEnum.ACTIVE },
    { status: SubscriptionStatusEnum.INACTIVE },
  );

  // Determine expiration date
  const expiresAt = plan.isFree
    ? new Date('2099-12-31')
    : new Date(new Date().setMonth(new Date().getMonth() + parseInt(plan.duration)));

  // Save payment
  const payment = await this.paymentRepository.save({
    description: `Payment for ${plan.name}`,
    userId: user.id,
    reference: data.reference || generateUniqueReference(),
    amount: amountPaid,
    paymentMethod: 'transfer',
    status: paymentStatus,
  });

  // Save subscription
  await this.subscriptionRepository.save({
    userId: user.id,
    planId: plan.id,
    paymentId: payment.id,
    expiresAt,
    status: SubscriptionStatusEnum.ACTIVE,
  });

  return { message: 'Subscription renewed successfully' };
}

  }