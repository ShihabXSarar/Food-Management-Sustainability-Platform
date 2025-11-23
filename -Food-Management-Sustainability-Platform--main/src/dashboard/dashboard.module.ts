// dashboard.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  FoodItem,
  FoodItemSchema,
} from '../food-items/schemas/food-item.schema';
import {
  Inventory,
  InventorySchema,
} from '../inventory/schemas/inventory.schema';
import { FoodLog, FoodLogSchema } from '../food-log/schemas/food-log.schema';
import { Resource, ResourceSchema } from 'src/resources/schemas/resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FoodItem.name, schema: FoodItemSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: FoodLog.name, schema: FoodLogSchema },
      { name: Resource.name, schema: ResourceSchema }, // ✅ added
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
