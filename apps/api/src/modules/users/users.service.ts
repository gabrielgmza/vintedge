/**
 * Users Service
 * User management business logic
 * @module modules/users/users.service
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma, User, UserAddress } from '@prisma/client';

export interface UpdateProfileDto {
  displayName?: string;
  photoUrl?: string;
  phoneNumber?: string;
}

export interface UpdatePreferencesDto {
  language?: string;
  country?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export interface CreateAddressDto {
  label?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault?: boolean;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by Firebase UID
   */
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Get user profile with addresses
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`Updating profile for user ${userId}`);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: data.displayName,
        photoUrl: data.photoUrl,
        phoneNumber: data.phoneNumber,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    userId: string,
    preferences: UpdatePreferencesDto
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentPrefs = (user.preferences as Record<string, unknown>) || {};
    const updatedPrefs = { ...currentPrefs, ...preferences };

    this.logger.log(`Updating preferences for user ${userId}`);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences: updatedPrefs as Prisma.JsonObject,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Verify user age
   */
  async verifyAge(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`Age verification for user ${userId}`);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ageVerified: true,
        ageVerifiedAt: new Date(),
      },
    });
  }

  /**
   * Create new address
   */
  async createAddress(
    userId: string,
    data: CreateAddressDto
  ): Promise<UserAddress> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If this is the default address, unset other defaults
    if (data.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default
    const addressCount = await this.prisma.userAddress.count({
      where: { userId },
    });

    this.logger.log(`Creating address for user ${userId}`);

    return this.prisma.userAddress.create({
      data: {
        userId,
        label: data.label || 'Home',
        fullName: data.fullName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country.toUpperCase(),
        phoneNumber: data.phoneNumber,
        isDefault: data.isDefault || addressCount === 0,
      },
    });
  }

  /**
   * Update address
   */
  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<CreateAddressDto>
  ): Promise<UserAddress> {
    const address = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (data.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    this.logger.log(`Updating address ${addressId} for user ${userId}`);

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: {
        ...data,
        country: data.country?.toUpperCase(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete address
   */
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    this.logger.log(`Deleting address ${addressId} for user ${userId}`);

    await this.prisma.userAddress.delete({
      where: { id: addressId },
    });

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const firstAddress = await this.prisma.userAddress.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      if (firstAddress) {
        await this.prisma.userAddress.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }
  }

  /**
   * List user addresses
   */
  async listAddresses(userId: string): Promise<UserAddress[]> {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Set default address
   */
  async setDefaultAddress(
    userId: string,
    addressId: string
  ): Promise<UserAddress> {
    const address = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.userAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
