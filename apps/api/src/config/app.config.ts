/**
 * Application configuration
 * @module config/app
 */

import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: 'Vintedge API',
  version: process.env.npm_package_version || '1.0.0',
  port: parseInt(process.env.PORT || '4000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',

  // CORS
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],

  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Security
  encryptionKey: process.env.ENCRYPTION_KEY,
  encryptionIv: process.env.ENCRYPTION_IV,

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // URLs
  appUrl: process.env.APP_URL || 'https://vintedge.vip',
  apiUrl: process.env.API_URL || 'https://api.vintedge.vip',

  // Features
  features: {
    aiRecommendations: process.env.ENABLE_AI_RECOMMENDATIONS === 'true',
    weatherIntegration: process.env.ENABLE_WEATHER_INTEGRATION === 'true',
    analytics: process.env.ENABLE_ANALYTICS === 'true',
  },

  // Supported locales
  supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'en,es,pt,hi,ja').split(','),
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  supportedCountries: (process.env.SUPPORTED_COUNTRIES || 'CA,US,MX,CO,BR,CL,AR,GB,NL,IN,JP').split(','),

  // Timeouts
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10), // 30 seconds
}));
