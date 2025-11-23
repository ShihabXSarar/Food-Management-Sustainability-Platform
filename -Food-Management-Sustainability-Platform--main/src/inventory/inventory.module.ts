import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { FoodItemsModule } from '../food-items/food-items.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
    FoodItemsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule { }
