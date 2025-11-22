import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodItemsService } from './food-items.service';
import { FoodItemsController } from './food-items.controller';
import { FoodItem, FoodItemSchema } from './schemas/food-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FoodItem.name, schema: FoodItemSchema },
    ]),
  ],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
  exports: [FoodItemsService],
})
export class FoodItemsModule {}
