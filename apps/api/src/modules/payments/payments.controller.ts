/**
 * Payments Controller
 * Payment processing endpoints
 * @module modules/payments/payments.controller
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  RawBodyRequest,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../database/prisma.service';

class CreatePaymentIntentDto {
  orderId!: string;
}

@ApiTags('payments')
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService
  ) {}

  @Post('create-intent')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-auth')
  @ApiOperation({ summary: 'Create payment intent for order' })
  @ApiResponse({ status: 201, description: 'Payment intent created' })
  @ApiResponse({ status: 400, description: 'Invalid order' })
  async createPaymentIntent(
    @CurrentUser() user: { uid: string; userId: string; email: string },
    @Body() body: CreatePaymentIntentDto
  ) {
    // Get order and verify ownership
    const order = await this.prisma.order.findFirst({
      where: {
        id: body.orderId,
        userId: user.userId,
        status: 'PENDING_PAYMENT',
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found or already paid');
    }

    // Get or create Stripe customer
    const customerId = await this.paymentsService.getOrCreateCustomer(
      user.userId,
      user.email
    );

    // Create payment intent
    return this.paymentsService.createPaymentIntent({
      orderId: order.id,
      amount: order.totalAmount,
      customerId,
      metadata: {
        orderNumber: order.orderNumber,
      },
    });
  }

  @Get('intent/:paymentIntentId')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-auth')
  @ApiOperation({ summary: 'Get payment intent status' })
  @ApiParam({ name: 'paymentIntentId', description: 'Stripe Payment Intent ID' })
  @ApiResponse({ status: 200, description: 'Payment intent details' })
  async getPaymentIntent(@Param('paymentIntentId') paymentIntentId: string) {
    const intent = await this.paymentsService.getPaymentIntent(paymentIntentId);

    return {
      id: intent.id,
      status: intent.status,
      amount: intent.amount,
      currency: intent.currency,
    };
  }

  @Post('intent/:paymentIntentId/cancel')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel payment intent' })
  @ApiParam({ name: 'paymentIntentId', description: 'Stripe Payment Intent ID' })
  @ApiResponse({ status: 200, description: 'Payment intent cancelled' })
  async cancelPaymentIntent(
    @CurrentUser() user: { uid: string; userId: string },
    @Param('paymentIntentId') paymentIntentId: string
  ) {
    // Verify user owns the order associated with this payment intent
    const order = await this.prisma.order.findFirst({
      where: {
        userId: user.userId,
        paymentInfo: {
          path: ['stripePaymentIntentId'],
          equals: paymentIntentId,
        },
      },
    });

    if (!order) {
      throw new BadRequestException('Payment not found');
    }

    await this.paymentsService.cancelPaymentIntent(paymentIntentId);

    return { cancelled: true };
  }

  @Get('methods')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-auth')
  @ApiOperation({ summary: 'List saved payment methods' })
  @ApiResponse({ status: 200, description: 'List of payment methods' })
  async listPaymentMethods(
    @CurrentUser() user: { uid: string; userId: string }
  ) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    const preferences = dbUser?.preferences as Record<string, unknown>;
    const customerId = preferences?.stripeCustomerId as string;

    if (!customerId) {
      return { paymentMethods: [] };
    }

    const methods = await this.paymentsService.listPaymentMethods(customerId);

    return {
      paymentMethods: methods.map((method) => ({
        id: method.id,
        brand: method.card?.brand,
        last4: method.card?.last4,
        expMonth: method.card?.exp_month,
        expYear: method.card?.exp_year,
      })),
    };
  }

  @Post('methods/:paymentMethodId/detach')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth('firebase-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove saved payment method' })
  @ApiParam({ name: 'paymentMethodId', description: 'Stripe Payment Method ID' })
  @ApiResponse({ status: 200, description: 'Payment method removed' })
  async detachPaymentMethod(
    @Param('paymentMethodId') paymentMethodId: string
  ) {
    await this.paymentsService.detachPaymentMethod(paymentMethodId);
    return { detached: true };
  }

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiHeader({ name: 'stripe-signature', required: true })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }
}
