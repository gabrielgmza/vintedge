/**
 * Database configuration
 * @module config/database
 */

import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // PostgreSQL (Cloud SQL)
  url: process.env.DATABASE_URL,
  socketPath: process.env.DATABASE_SOCKET_PATH,

  // Connection pool
  poolMin: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
  poolMax: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),

  // Timeouts
  connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '10000', 10),
  idleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '60000', 10),

  // SSL (required for Cloud SQL)
  ssl: process.env.NODE_ENV === 'production',

  // Logging
  logging: process.env.DATABASE_LOGGING === 'true',

  // Redis
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: 'vintedge:',
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // 1 hour default
  },

  // Firestore
  firestore: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseId: process.env.FIRESTORE_DATABASE_ID || '(default)',
  },
}));
