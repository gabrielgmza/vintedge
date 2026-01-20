/**
 * Stripe configuration
 * @module config/stripe
 */

import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // API version
  apiVersion: '2023-10-16' as const,

  // Currency
  currency: 'usd',

  // Payment methods
  paymentMethods: ['card', 'paypal'],

  // Metadata
  metadata: {
    platform: 'vintedge',
    version: process.env.npm_package_version || '1.0.0',
  },

  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // 1 second

  // Webhook events to handle
  webhookEvents: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.canceled',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.paid',
    'invoice.payment_failed',
    'charge.refunded',
    'charge.dispute.created',
  ],
}));
