/**
 * Roles Decorator
 * Restricts routes to specific user roles
 * @module modules/auth/decorators/roles
 */

import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@vintedge/shared';

export const ROLES_KEY = 'roles';

/**
 * Decorator to restrict route to specific roles
 * @example
 * @Roles('admin', 'support')
 * @Get('admin/users')
 * listUsers() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
