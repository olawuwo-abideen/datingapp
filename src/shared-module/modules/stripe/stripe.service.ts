import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

constructor(private configService: ConfigService) {
  const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
  if (!stripeKey) {
    throw new Error('Missing STRIPE_SECRET_KEY in config');
  }

  this.stripe = new Stripe(stripeKey, {
    apiVersion: '2025-06-30.basil',
  });
}


  async verifyPayment(paymentIntentId: string) {
    try {
      const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (!intent || intent.status !== 'succeeded') {
        throw new BadRequestException('Payment not successful.');
      }

      return {
        status: 'Paid',
        amount: (intent.amount_received / 100).toFixed(2),
        currency: intent.currency,
        raw: intent,
      };
    } catch (error) {
      throw new BadRequestException('Failed to verify Stripe payment.');
    }
  }
}
