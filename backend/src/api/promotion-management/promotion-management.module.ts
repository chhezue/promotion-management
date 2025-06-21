import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionManagementRepository } from './promotion-management.repository';
import { PromotionManagementService } from './promotion-management.service';
import { PromotionManagementController } from './promotion-management.controller';
import {
  PromotionAuth,
  PromotionAuthSchema,
  PromotionNodes,
  PromotionNodesSchema,
  PromotionSites,
  PromotionSitesSchema,
} from '@src/db/schema/promotion-management.schema';
import { StorageService } from '../storage/storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromotionNodes.name, schema: PromotionNodesSchema },
      { name: PromotionSites.name, schema: PromotionSitesSchema },
      { name: PromotionAuth.name, schema: PromotionAuthSchema },
    ]),
  ],
  controllers: [PromotionManagementController],
  providers: [PromotionManagementService, PromotionManagementRepository, StorageService],
})
export class PromotionManagementModule {} 