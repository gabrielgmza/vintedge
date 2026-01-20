/**
 * Current User Decorator
 * Extracts authenticated user from request
 * @module modules/auth/decorators/current-user
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from '../guards/firebase-auth.guard';

/**
 * Decorator to get the current authenticated user
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthenticatedUser) { ... }
 * 
 * @Get('profile')
 * getProfile(@CurrentUser('uid') uid: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedRequest['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

/**
 * Type for the authenticated user object
 */
export type AuthenticatedUser = AuthenticatedRequest['user'];
