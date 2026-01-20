/**
 * Prisma Service
 * Database connection management with health checks
 * @module database/prisma
 */

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const isProduction = configService.get('NODE_ENV') === 'production';
    const logLevel = configService.get('DATABASE_LOGGING') === 'true';

    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log: logLevel
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
          ]
        : [{ emit: 'event', level: 'error' }],
      errorFormat: isProduction ? 'minimal' : 'pretty',
    });

    // Query logging (only in development with logging enabled)
    if (logLevel && !isProduction) {
      this.$on('query', (e) => {
        this.logger.debug({
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      });
    }

    // Error logging
    this.$on('error', (e) => {
      this.logger.error({ message: e.message, target: e.target }, 'Prisma error');
    });

    // Warning logging
    this.$on('warn', (e) => {
      this.logger.warn({ message: e.message, target: e.target }, 'Prisma warning');
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to database...');

    try {
      await this.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error({ error }, 'Failed to connect to database');
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  /**
   * Health check - verifies database connectivity
   */
  async healthCheck(): Promise<{ status: 'up' | 'down'; latency?: number; message?: string }> {
    const startTime = Date.now();

    try {
      await this.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;

      return {
        status: 'up',
        latency,
      };
    } catch (error) {
      return {
        status: 'down',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Clean database (for testing only)
   */
  async cleanDatabase(): Promise<void> {
    if (this.configService.get('NODE_ENV') === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const tablenames = await this.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      }
    }
  }
}
