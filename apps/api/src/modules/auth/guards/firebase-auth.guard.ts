/**
 * Firebase Auth Guard
 * Validates Firebase ID tokens in Authorization header
 * @module modules/auth/guards/firebase-auth
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { FirebaseAdminService } from '../firebase-admin.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { UserRole } from '@vintedge/shared';

export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
    emailVerified: boolean;
    role?: UserRole;
    claims?: Record<string, unknown>;
  };
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        code: 'AUTHENTICATION_ERROR',
        message: 'Authorization token is required',
      });
    }

    try {
      const decodedToken = await this.firebaseAdmin.verifyIdToken(token);

      // Attach user info to request
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        emailVerified: decodedToken.email_verified || false,
        role: decodedToken.role as UserRole,
        claims: decodedToken,
      };

      // Check role requirements
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = request.user.role;
        
        if (!userRole || !requiredRoles.includes(userRole)) {
          throw new UnauthorizedException({
            code: 'AUTHORIZATION_ERROR',
            message: 'Insufficient permissions',
          });
        }
      }

      return true;
    } catch (error) {
      // Log the error for debugging
      this.logger.warn(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'Token verification failed',
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid or expired token',
      });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
