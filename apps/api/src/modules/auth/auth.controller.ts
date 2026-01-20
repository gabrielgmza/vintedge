/**
 * Auth Controller
 * Authentication endpoints
 * @module modules/auth/auth.controller
 */

import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CurrentUser, AuthenticatedUser } from './decorators/current-user.decorator';
import { RegisterDto, VerifyAgeDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register or login user after Firebase authentication
   * Called from client after successful Firebase sign-in
   */
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register or login user after Firebase auth' })
  @ApiResponse({ status: 201, description: 'User registered/logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.registerOrLogin({
      firebaseUid: dto.firebaseUid,
      email: dto.email,
      displayName: dto.displayName,
      photoUrl: dto.photoUrl,
      authProvider: dto.authProvider,
      language: dto.language,
      country: dto.country,
    });

    return {
      user: result.user,
      isNewUser: result.isNewUser,
      message: result.isNewUser ? 'User registered successfully' : 'User logged in successfully',
    };
  }

  /**
   * Get current user profile
   */
  @Get('me')
  @ApiBearerAuth('firebase-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() authUser: AuthenticatedUser) {
    const user = await this.authService.getUserByFirebaseUid(authUser.uid);

    if (!user) {
      // User exists in Firebase but not in our database
      // This can happen if user was created externally
      return {
        requiresRegistration: true,
        firebaseUid: authUser.uid,
        email: authUser.email,
      };
    }

    return { user };
  }

  /**
   * Verify user age (checkbox confirmation)
   */
  @Post('verify-age')
  @ApiBearerAuth('firebase-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user age' })
  @ApiResponse({ status: 200, description: 'Age verified' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verifyAge(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() dto: VerifyAgeDto,
  ) {
    const user = await this.authService.getUserByFirebaseUid(authUser.uid);

    if (!user) {
      return { error: 'User not found' };
    }

    if (!dto.confirmed) {
      return { error: 'Age verification not confirmed' };
    }

    const updatedUser = await this.authService.verifyAge(user.id);

    return {
      user: updatedUser,
      message: 'Age verified successfully',
    };
  }

  /**
   * Logout user (revoke tokens)
   */
  @Post('logout')
  @ApiBearerAuth('firebase-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and revoke tokens' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser() authUser: AuthenticatedUser) {
    await this.authService.logout(authUser.uid);

    return { message: 'Logged out successfully' };
  }

  /**
   * Delete user account
   */
  @Delete('account')
  @ApiBearerAuth('firebase-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user account permanently' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(@CurrentUser() authUser: AuthenticatedUser) {
    const user = await this.authService.getUserByFirebaseUid(authUser.uid);

    if (!user) {
      return { error: 'User not found' };
    }

    await this.authService.deleteAccount(user.id, authUser.uid);

    return { message: 'Account deleted successfully' };
  }
}
