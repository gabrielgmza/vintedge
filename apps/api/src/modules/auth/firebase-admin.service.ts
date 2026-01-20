/**
 * Firebase Admin Service
 * Initializes and provides Firebase Admin SDK
 * @module modules/auth/firebase-admin
 */

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const projectId = this.configService.get<string>('firebase.projectId');

    if (admin.apps.length > 0) {
      this.app = admin.apps[0]!;
      this.logger.log('Firebase Admin already initialized');
      return;
    }

    try {
      const clientEmail = this.configService.get<string>('firebase.adminClientEmail');
      const privateKey = this.configService.get<string>('firebase.adminPrivateKey');

      // Use explicit credentials if provided, otherwise use ADC (Application Default Credentials)
      // ADC is automatically available in Cloud Run
      if (clientEmail && privateKey) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          projectId,
        });
        this.logger.log('Firebase Admin initialized with service account');
      } else {
        this.app = admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId,
        });
        this.logger.log('Firebase Admin initialized with ADC');
      }
    } catch (error) {
      this.logger.error({ error }, 'Failed to initialize Firebase Admin');
      throw error;
    }
  }

  /**
   * Get Firebase Auth instance
   */
  get auth(): admin.auth.Auth {
    return this.app.auth();
  }

  /**
   * Get Firestore instance
   */
  get firestore(): admin.firestore.Firestore {
    return this.app.firestore();
  }

  /**
   * Get Storage instance
   */
  get storage(): admin.storage.Storage {
    return this.app.storage();
  }

  /**
   * Verify Firebase ID token
   */
  async verifyIdToken(idToken: string, checkRevoked = true): Promise<admin.auth.DecodedIdToken> {
    return this.auth.verifyIdToken(idToken, checkRevoked);
  }

  /**
   * Get user by UID
   */
  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    return this.auth.getUser(uid);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    return this.auth.getUserByEmail(email);
  }

  /**
   * Create custom token
   */
  async createCustomToken(uid: string, claims?: Record<string, unknown>): Promise<string> {
    return this.auth.createCustomToken(uid, claims);
  }

  /**
   * Set custom claims on user
   */
  async setCustomClaims(uid: string, claims: Record<string, unknown>): Promise<void> {
    await this.auth.setCustomUserClaims(uid, claims);
  }

  /**
   * Revoke refresh tokens
   */
  async revokeRefreshTokens(uid: string): Promise<void> {
    await this.auth.revokeRefreshTokens(uid);
  }

  /**
   * Delete user
   */
  async deleteUser(uid: string): Promise<void> {
    await this.auth.deleteUser(uid);
  }
}
