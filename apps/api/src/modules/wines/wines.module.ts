/**
 * Wines Module
 * Wine catalog management
 * @module modules/wines
 */

import { Module } from '@nestjs/common';
import { WinesController } from './wines.controller';
import { WinesService } from './wines.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WinesController],
  providers: [WinesService],
  exports: [WinesService],
})
export class WinesModule {}

// TODO: Implement
// - WinesController
// - WinesService
// - Wine catalog CRUD
// - Search and filtering
// - Stock management
