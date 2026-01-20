/**
 * Health Controller
 * Health check endpoints for monitoring
 * @module modules/health/health.controller
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Basic liveness check
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: this.config.get('app.version', '1.0.0'),
      environment: this.config.get('app.nodeEnv', 'development'),
    };
  }

  /**
   * Detailed readiness check
   */
  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'Readiness check with service status' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service not ready' })
  async readiness() {
    const dbHealth = await this.prisma.healthCheck();

    const isHealthy = dbHealth.status === 'up';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: this.config.get('app.version', '1.0.0'),
      services: {
        database: dbHealth,
      },
    };
  }

  /**
   * Liveness probe for Kubernetes/Cloud Run
   */
  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Service is live' })
  live() {
    return { status: 'live' };
  }
}
