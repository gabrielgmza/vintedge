/**
 * Users Controller
 * User management endpoints
 * @module modules/users/users.controller
 */

import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  UsersService,
  UpdateProfileDto,
  UpdatePreferencesDto,
  CreateAddressDto,
} from './users.service';

@ApiTags('users')
@ApiBearerAuth('firebase-auth')
@UseGuards(FirebaseAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@CurrentUser() user: { uid: string; userId: string }) {
    return this.usersService.getProfile(user.userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser() user: { uid: string; userId: string },
    @Body() data: UpdateProfileDto
  ) {
    return this.usersService.updateProfile(user.userId, data);
  }

  @Put('me/preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  async updatePreferences(
    @CurrentUser() user: { uid: string; userId: string },
    @Body() data: UpdatePreferencesDto
  ) {
    return this.usersService.updatePreferences(user.userId, data);
  }

  @Post('me/verify-age')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user age (checkbox confirmation)' })
  @ApiResponse({ status: 200, description: 'Age verified' })
  async verifyAge(@CurrentUser() user: { uid: string; userId: string }) {
    return this.usersService.verifyAge(user.userId);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'List user addresses' })
  @ApiResponse({ status: 200, description: 'Addresses retrieved' })
  async listAddresses(@CurrentUser() user: { uid: string; userId: string }) {
    return this.usersService.listAddresses(user.userId);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Create new address' })
  @ApiResponse({ status: 201, description: 'Address created' })
  async createAddress(
    @CurrentUser() user: { uid: string; userId: string },
    @Body() data: CreateAddressDto
  ) {
    return this.usersService.createAddress(user.userId, data);
  }

  @Put('me/addresses/:addressId')
  @ApiOperation({ summary: 'Update address' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address updated' })
  async updateAddress(
    @CurrentUser() user: { uid: string; userId: string },
    @Param('addressId') addressId: string,
    @Body() data: Partial<CreateAddressDto>
  ) {
    return this.usersService.updateAddress(user.userId, addressId, data);
  }

  @Delete('me/addresses/:addressId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete address' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 204, description: 'Address deleted' })
  async deleteAddress(
    @CurrentUser() user: { uid: string; userId: string },
    @Param('addressId') addressId: string
  ) {
    await this.usersService.deleteAddress(user.userId, addressId);
  }

  @Put('me/addresses/:addressId/default')
  @ApiOperation({ summary: 'Set default address' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Default address set' })
  async setDefaultAddress(
    @CurrentUser() user: { uid: string; userId: string },
    @Param('addressId') addressId: string
  ) {
    return this.usersService.setDefaultAddress(user.userId, addressId);
  }
}
