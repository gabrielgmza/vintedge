/**
 * Wines Controller
 * Wine catalog endpoints
 * @module modules/wines/wines.controller
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WineType, WineClassification } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import {
  WinesService,
  WineFilters,
  PaginationParams,
  PriceCalculationInput,
} from './wines.service';

@ApiTags('wines')
@Controller({ path: 'wines', version: '1' })
export class WinesController {
  constructor(private readonly winesService: WinesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List wines with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: WineType, isArray: true })
  @ApiQuery({ name: 'region', required: false, type: String, isArray: true })
  @ApiQuery({
    name: 'classification',
    required: false,
    enum: WineClassification,
    isArray: true,
  })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'List of wines' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: WineType | WineType[],
    @Query('region') region?: string | string[],
    @Query('classification')
    classification?: WineClassification | WineClassification[],
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('inStock') inStock?: boolean,
    @Query('country') country?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    const filters: WineFilters = {
      type: type ? (Array.isArray(type) ? type : [type]) : undefined,
      region: region ? (Array.isArray(region) ? region : [region]) : undefined,
      classification: classification
        ? Array.isArray(classification)
          ? classification
          : [classification]
        : undefined,
      minPrice: minPrice ? minPrice * 100 : undefined, // Convert to cents
      maxPrice: maxPrice ? maxPrice * 100 : undefined,
      inStock,
      country,
    };

    const pagination: PaginationParams = {
      page: page || 1,
      limit: limit || 20,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    };

    return this.winesService.findAll(filters, pagination);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured wines' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Featured wines' })
  async getFeatured(@Query('limit') limit?: number) {
    return this.winesService.getFeatured(limit || 6);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search wines' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.winesService.search(query, { page, limit });
  }

  @Get('type/:type')
  @Public()
  @ApiOperation({ summary: 'Get wines by type' })
  @ApiParam({ name: 'type', enum: WineType })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Wines of specified type' })
  async getByType(
    @Param('type') type: WineType,
    @Query('limit') limit?: number
  ) {
    return this.winesService.getByType(type, limit || 10);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get wine detail' })
  @ApiParam({ name: 'id', description: 'Wine ID' })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Wine details' })
  @ApiResponse({ status: 404, description: 'Wine not found' })
  async getDetail(@Param('id') id: string, @Query('country') country?: string) {
    return this.winesService.getDetail(id, country);
  }

  @Get(':id/availability')
  @Public()
  @ApiOperation({ summary: 'Check wine availability' })
  @ApiParam({ name: 'id', description: 'Wine ID' })
  @ApiQuery({ name: 'quantity', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Availability status' })
  async checkAvailability(
    @Param('id') id: string,
    @Query('quantity') quantity: number
  ) {
    return this.winesService.checkAvailability(id, quantity || 1);
  }

  @Post('calculate-price')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate dynamic price for customization' })
  @ApiResponse({ status: 200, description: 'Price calculation result' })
  async calculatePrice(@Body() input: PriceCalculationInput) {
    return this.winesService.calculateFullPrice(input);
  }
}
