import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodLogService } from './food-log.service';
import { FoodLogController } from './food-log.controller';
import { FoodLog, FoodLogSchema } from './schemas/food-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FoodLog.name, schema: FoodLogSchema }]),
  ],
  controllers: [FoodLogController],
  providers: [FoodLogService],
  exports: [FoodLogService],
})
export class FoodLogModule {}
