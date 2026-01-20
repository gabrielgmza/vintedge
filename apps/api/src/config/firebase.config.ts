/**
 * Firebase configuration
 * @module config/firebase
 */

import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => ({
  projectId: process.env.FIREBASE_PROJECT_ID,

  // Admin SDK credentials (for Cloud Run, uses ADC by default)
  adminClientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  adminPrivateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),

  // Client SDK config (for reference)
  client: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  },

  // Auth settings
  auth: {
    tokenExpiration: parseInt(process.env.FIREBASE_TOKEN_EXPIRATION || '3600', 10), // 1 hour
    sessionCookieExpiration: parseInt(process.env.FIREBASE_SESSION_EXPIRATION || '604800', 10), // 7 days
  },

  // Storage
  storage: {
    bucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE || '10485760', 10), // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ],
  },
}));
