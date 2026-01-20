/**
 * Wines Service
 * Wine catalog and dynamic pricing logic
 * @module modules/wines/wines.service
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Wine, WineType, WineClassification, Prisma } from '@prisma/client';

export interface WineFilters {
  type?: WineType[];
  region?: string[];
  classification?: WineClassification[];
  grapeVarieties?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  vintage?: number[];
  inStock?: boolean;
  country?: string; // User's country to filter restricted wines
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PriceCalculationInput {
  wineId: string;
  bottle: {
    shape: string;
    color: string;
    capacity: number;
  };
  cork: {
    type: string;
    engraving?: string;
  };
  capsule: {
    type: string;
    color?: string;
  };
  label: {
    material: string;
    shape: string;
    hasCustomImage: boolean;
  };
  packaging: {
    type: string;
    engraving?: string;
    includeCertificate: boolean;
    includeStoryCard: boolean;
    giftWrapping: boolean;
  };
  quantity: number;
}

// Price modifiers in cents
const BOTTLE_PRICES: Record<string, Record<string, number>> = {
  shape: {
    bordeaux: 0,
    burgundy: 200,
    alsace: 300,
    champagne: 500,
    port: 400,
  },
  color: {
    green: 0,
    amber: 100,
    clear: 50,
    blue: 200,
    black: 250,
  },
  capacity: {
    375: -500,
    750: 0,
    1000: 800,
    1500: 1500,
  },
};

const CORK_PRICES: Record<string, number> = {
  'natural-premium': 500,
  'natural-standard': 0,
  'technical-diam': 300,
  screwcap: 100,
  'glass-stopper': 800,
};

const CAPSULE_PRICES: Record<string, number> = {
  'tin-printed': 0,
  'wax-seal': 400,
  'custom-foil': 600,
  none: -100,
};

const LABEL_PRICES: Record<string, Record<string, number>> = {
  material: {
    'paper-matte': 0,
    'paper-glossy': 100,
    textured: 300,
    metallic: 500,
    transparent: 400,
  },
  shape: {
    rectangle: 0,
    oval: 200,
    custom: 500,
  },
};

const PACKAGING_PRICES: Record<string, number> = {
  'cardboard-standard': 0,
  'wood-walnut': 2000,
  'leather-italian': 5000,
  'museum-box': 8000,
  'collector-6': 3000,
  'collector-12': 5000,
};

const EXTRAS_PRICES = {
  corkEngraving: 300,
  packagingEngraving: 500,
  certificate: 200,
  storyCard: 150,
  giftWrapping: 300,
  customImage: 400,
};

// Volume discounts (percentage off)
const VOLUME_DISCOUNTS: { minQuantity: number; discount: number }[] = [
  { minQuantity: 6, discount: 5 },
  { minQuantity: 12, discount: 10 },
  { minQuantity: 24, discount: 15 },
  { minQuantity: 48, discount: 20 },
];

@Injectable()
export class WinesService {
  private readonly logger = new Logger(WinesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get wine by ID
   */
  async findById(id: string): Promise<Wine | null> {
    return this.prisma.wine.findUnique({
      where: { id },
    });
  }

  /**
   * Get wine by SKU
   */
  async findBySku(sku: string): Promise<Wine | null> {
    return this.prisma.wine.findUnique({
      where: { sku },
    });
  }

  /**
   * List wines with filters and pagination
   */
  async findAll(
    filters: WineFilters = {},
    pagination: PaginationParams = {}
  ): Promise<{ wines: Wine[]; total: number; page: number; totalPages: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = pagination;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.WineWhereInput = {
      isAvailable: true,
    };

    if (filters.type?.length) {
      where.type = { in: filters.type };
    }

    if (filters.region?.length) {
      where.region = { in: filters.region };
    }

    if (filters.classification?.length) {
      where.classification = { in: filters.classification };
    }

    if (filters.grapeVarieties?.length) {
      where.grapeVarieties = { hasSome: filters.grapeVarieties };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.basePrice = {};
      if (filters.minPrice !== undefined) {
        where.basePrice.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.basePrice.lte = filters.maxPrice;
      }
    }

    if (filters.vintage?.length) {
      where.vintage = { in: filters.vintage };
    }

    if (filters.inStock) {
      where.stockQuantity = { gt: 0 };
    }

    // Filter out wines restricted in user's country
    if (filters.country) {
      where.NOT = {
        restrictedCountries: { has: filters.country },
      };
    }

    const [wines, total] = await Promise.all([
      this.prisma.wine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.wine.count({ where }),
    ]);

    return {
      wines,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get wine detail with availability check
   */
  async getDetail(id: string, userCountry?: string): Promise<Wine> {
    const wine = await this.prisma.wine.findUnique({
      where: { id },
    });

    if (!wine) {
      throw new NotFoundException('Wine not found');
    }

    if (!wine.isAvailable) {
      throw new BadRequestException('Wine is not available');
    }

    if (userCountry && wine.restrictedCountries.includes(userCountry)) {
      throw new BadRequestException(
        'This wine is not available in your country'
      );
    }

    return wine;
  }

  /**
   * Calculate dynamic price for customization
   */
  calculatePrice(input: PriceCalculationInput): {
    breakdown: Record<string, number>;
    unitPrice: number;
    volumeDiscount: number;
    totalPrice: number;
  } {
    const breakdown: Record<string, number> = {};

    // Base wine price will be added by caller after fetching from DB

    // Bottle customization
    const shapePrice = BOTTLE_PRICES.shape[input.bottle.shape];
    breakdown.bottleShape = shapePrice !== undefined ? shapePrice : 0;
    
    const colorPrice = BOTTLE_PRICES.color[input.bottle.color];
    breakdown.bottleColor = colorPrice !== undefined ? colorPrice : 0;
    
    const capacityPrice = BOTTLE_PRICES.capacity[input.bottle.capacity.toString()];
    breakdown.bottleCapacity = capacityPrice !== undefined ? capacityPrice : 0;

    // Cork customization
    const corkPrice = CORK_PRICES[input.cork.type];
    breakdown.cork = corkPrice !== undefined ? corkPrice : 0;
    if (input.cork.engraving) {
      breakdown.corkEngraving = EXTRAS_PRICES.corkEngraving;
    }

    // Capsule customization
    const capsulePrice = CAPSULE_PRICES[input.capsule.type];
    breakdown.capsule = capsulePrice !== undefined ? capsulePrice : 0;

    // Label customization
    const labelMaterialPrice = LABEL_PRICES.material[input.label.material];
    breakdown.labelMaterial = labelMaterialPrice !== undefined ? labelMaterialPrice : 0;
    
    const labelShapePrice = LABEL_PRICES.shape[input.label.shape];
    breakdown.labelShape = labelShapePrice !== undefined ? labelShapePrice : 0;
    if (input.label.hasCustomImage) {
      breakdown.customImage = EXTRAS_PRICES.customImage;
    }

    // Packaging customization
    const packagingPrice = PACKAGING_PRICES[input.packaging.type];
    breakdown.packaging = packagingPrice !== undefined ? packagingPrice : 0;
    if (input.packaging.engraving) {
      breakdown.packagingEngraving = EXTRAS_PRICES.packagingEngraving;
    }
    if (input.packaging.includeCertificate) {
      breakdown.certificate = EXTRAS_PRICES.certificate;
    }
    if (input.packaging.includeStoryCard) {
      breakdown.storyCard = EXTRAS_PRICES.storyCard;
    }
    if (input.packaging.giftWrapping) {
      breakdown.giftWrapping = EXTRAS_PRICES.giftWrapping;
    }

    // Calculate unit price (without base wine price)
    const customizationTotal = Object.values(breakdown).reduce(
      (sum, val) => sum + val,
      0
    );

    // Calculate volume discount
    let discountPercent = 0;
    for (const tier of VOLUME_DISCOUNTS) {
      if (input.quantity >= tier.minQuantity) {
        discountPercent = tier.discount;
      }
    }

    const volumeDiscount = Math.round(
      (customizationTotal * input.quantity * discountPercent) / 100
    );

    const totalBeforeDiscount = customizationTotal * input.quantity;
    const totalPrice = totalBeforeDiscount - volumeDiscount;

    return {
      breakdown,
      unitPrice: customizationTotal,
      volumeDiscount,
      totalPrice,
    };
  }

  /**
   * Calculate full price including wine base price
   */
  async calculateFullPrice(
    input: PriceCalculationInput
  ): Promise<{
    baseWinePrice: number;
    customizationPrice: number;
    breakdown: Record<string, number>;
    unitPrice: number;
    quantity: number;
    volumeDiscount: number;
    subtotal: number;
    total: number;
  }> {
    const wine = await this.findById(input.wineId);
    if (!wine) {
      throw new NotFoundException('Wine not found');
    }

    const priceCalc = this.calculatePrice(input);

    const unitPrice = wine.basePrice + priceCalc.unitPrice;
    const subtotal = unitPrice * input.quantity;
    const volumeDiscount = Math.round(
      (subtotal * this.getVolumeDiscountPercent(input.quantity)) / 100
    );
    const total = subtotal - volumeDiscount;

    return {
      baseWinePrice: wine.basePrice,
      customizationPrice: priceCalc.unitPrice,
      breakdown: {
        baseWine: wine.basePrice,
        ...priceCalc.breakdown,
      },
      unitPrice,
      quantity: input.quantity,
      volumeDiscount,
      subtotal,
      total,
    };
  }

  /**
   * Get volume discount percentage
   */
  private getVolumeDiscountPercent(quantity: number): number {
    let discountPercent = 0;
    for (const tier of VOLUME_DISCOUNTS) {
      if (quantity >= tier.minQuantity) {
        discountPercent = tier.discount;
      }
    }
    return discountPercent;
  }

  /**
   * Check wine availability
   */
  async checkAvailability(
    wineId: string,
    quantity: number
  ): Promise<{ available: boolean; stockQuantity: number }> {
    const wine = await this.findById(wineId);
    if (!wine) {
      throw new NotFoundException('Wine not found');
    }

    return {
      available: wine.isAvailable && wine.stockQuantity >= quantity,
      stockQuantity: wine.stockQuantity,
    };
  }

  /**
   * Get featured wines
   */
  async getFeatured(limit: number = 6): Promise<Wine[]> {
    return this.prisma.wine.findMany({
      where: {
        isAvailable: true,
        stockQuantity: { gt: 0 },
      },
      orderBy: [{ ratings: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });
  }

  /**
   * Get wines by type
   */
  async getByType(type: WineType, limit: number = 10): Promise<Wine[]> {
    return this.prisma.wine.findMany({
      where: {
        type,
        isAvailable: true,
        stockQuantity: { gt: 0 },
      },
      orderBy: { basePrice: 'asc' },
      take: limit,
    });
  }

  /**
   * Search wines
   */
  async search(
    query: string,
    pagination: PaginationParams = {}
  ): Promise<{ wines: Wine[]; total: number }> {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.WineWhereInput = {
      isAvailable: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { region: { contains: query, mode: 'insensitive' } },
        { grapeVarieties: { has: query.toLowerCase() } },
      ],
    };

    const [wines, total] = await Promise.all([
      this.prisma.wine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.wine.count({ where }),
    ]);

    return { wines, total };
  }
}
