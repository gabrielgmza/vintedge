/**
 * Payments Service
 * Stripe payment processing with PCI compliance
 * @module modules/payments/payments.service
 */

import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';

export interface CreatePaymentIntentInput {
  orderId: string;
  amount: number; // in cents
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface ConfirmPaymentInput {
  paymentIntentId: string;
  paymentMethodId: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  /**
   * Create or get Stripe customer
   */
  async getOrCreateCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<string> {
    // Check if user already has a Stripe customer ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const preferences = user.preferences as Record<string, unknown>;
    const existingCustomerId = preferences?.stripeCustomerId as string;

    if (existingCustomerId) {
      // Verify customer still exists in Stripe
      try {
        await this.stripe.customers.retrieve(existingCustomerId);
        return existingCustomerId;
      } catch {
        this.logger.warn(
          `Stripe customer ${existingCustomerId} not found, creating new one`
        );
      }
    }

    // Create new Stripe customer
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    // Save customer ID to user preferences
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          ...preferences,
          stripeCustomerId: customer.id,
        },
      },
    });

    this.logger.log(`Created Stripe customer ${customer.id} for user ${userId}`);

    return customer.id;
  }

  /**
   * Create payment intent for order
   */
  async createPaymentIntent(
    input: CreatePaymentIntentInput
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const { orderId, amount, currency = 'usd', customerId, metadata = {} } = input;

    if (amount < 50) {
      throw new BadRequestException('Amount must be at least $0.50 USD');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        metadata: {
          orderId,
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(
        `Created payment intent ${paymentIntent.id} for order ${orderId}`
      );

      // Update order with payment intent ID
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentInfo: {
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId: customerId || null,
            status: 'pending',
            amount,
            currency,
          },
        },
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw new InternalServerErrorException('Failed to create payment');
    }
  }

  /**
   * Retrieve payment intent status
   */
  async getPaymentIntent(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error(`Failed to retrieve payment intent: ${paymentIntentId}`);
      throw new BadRequestException('Payment not found');
    }
  }

  /**
   * Cancel payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    try {
      await this.stripe.paymentIntents.cancel(paymentIntentId);
      this.logger.log(`Cancelled payment intent ${paymentIntentId}`);
    } catch (error) {
      this.logger.error(`Failed to cancel payment intent: ${paymentIntentId}`);
      throw new InternalServerErrorException('Failed to cancel payment');
    }
  }

  /**
   * Process refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount, // If undefined, refunds the full amount
        reason: (reason as Stripe.RefundCreateParams.Reason) || 'requested_by_customer',
      });

      this.logger.log(
        `Created refund ${refund.id} for payment intent ${paymentIntentId}`
      );

      return refund;
    } catch (error) {
      this.logger.error(
        `Failed to create refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw new InternalServerErrorException('Failed to process refund');
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(
    payload: Buffer,
    signature: string
  ): Promise<{ received: boolean; event?: string }> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET'
    );

    if (!webhookSecret) {
      throw new InternalServerErrorException('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (error) {
      this.logger.error(
        `Webhook signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'charge.refunded':
        await this.handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true, event: event.type };
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSuccess(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.warn('Payment intent missing orderId metadata');
      return;
    }

    const charge = paymentIntent.latest_charge as Stripe.Charge | null;

    await this.prisma.$transaction(async (tx) => {
      // Update order status and payment info
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          paidAt: new Date(),
          paymentInfo: {
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId: paymentIntent.customer as string,
            method: this.getPaymentMethod(paymentIntent),
            status: 'succeeded',
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            cardLast4: charge?.payment_method_details?.card?.last4 || null,
            cardBrand: charge?.payment_method_details?.card?.brand || null,
            receiptUrl: charge?.receipt_url || null,
            paidAt: new Date().toISOString(),
          },
        },
      });

      // Create order event
      await tx.orderEvent.create({
        data: {
          orderId,
          type: 'PAYMENT_SUCCEEDED',
          metadata: {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
          },
          performedBy: 'system',
          performedByRole: 'system',
        },
      });
    });

    this.logger.log(`Payment succeeded for order ${orderId}`);
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailure(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      this.logger.warn('Payment intent missing orderId metadata');
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAYMENT_FAILED,
          paymentInfo: {
            stripePaymentIntentId: paymentIntent.id,
            status: 'failed',
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            failureReason:
              paymentIntent.last_payment_error?.message || 'Payment failed',
          },
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId,
          type: 'PAYMENT_FAILED',
          metadata: {
            paymentIntentId: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message,
          },
          performedBy: 'system',
          performedByRole: 'system',
        },
      });
    });

    this.logger.log(`Payment failed for order ${orderId}`);
  }

  /**
   * Handle refund
   */
  private async handleRefund(charge: Stripe.Charge): Promise<void> {
    const paymentIntentId = charge.payment_intent as string;

    // Find order by payment intent
    const order = await this.prisma.order.findFirst({
      where: {
        paymentInfo: {
          path: ['stripePaymentIntentId'],
          equals: paymentIntentId,
        },
      },
    });

    if (!order) {
      this.logger.warn(`Order not found for payment intent ${paymentIntentId}`);
      return;
    }

    const isFullRefund = charge.amount_refunded === charge.amount;

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: isFullRefund ? OrderStatus.REFUNDED : order.status,
          paymentInfo: {
            ...(order.paymentInfo as Record<string, unknown>),
            status: isFullRefund ? 'refunded' : 'partially_refunded',
            refundedAmount: charge.amount_refunded,
          },
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          type: 'REFUND_COMPLETED',
          metadata: {
            refundAmount: charge.amount_refunded,
            isFullRefund,
          },
          performedBy: 'system',
          performedByRole: 'system',
        },
      });
    });

    this.logger.log(
      `Refund processed for order ${order.id}: ${charge.amount_refunded} cents`
    );
  }

  /**
   * Get payment method type from payment intent
   */
  private getPaymentMethod(
    paymentIntent: Stripe.PaymentIntent
  ): string {
    const pmTypes = paymentIntent.payment_method_types;
    if (pmTypes.includes('card')) return 'card';
    if (pmTypes.includes('paypal')) return 'paypal';
    if (pmTypes.includes('apple_pay')) return 'apple_pay';
    if (pmTypes.includes('google_pay')) return 'google_pay';
    return 'card';
  }

  /**
   * List customer payment methods
   */
  async listPaymentMethods(
    customerId: string
  ): Promise<Stripe.PaymentMethod[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string
  ): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  /**
   * Detach payment method from customer
   */
  async detachPaymentMethod(
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.detach(paymentMethodId);
  }
}
