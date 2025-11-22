import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FoodLog, FoodLogDocument } from './schemas/food-log.schema';
import { CreateFoodLogDto } from './dto/create-food-log.dto';

@Injectable()
export class FoodLogService {
  constructor(
    @InjectModel(FoodLog.name)
    private foodLogModel: Model<FoodLogDocument>,
  ) {}

  async create(userId: string, dto: CreateFoodLogDto) {
    return this.foodLogModel.create({
      user: userId,
      itemName: dto.itemName,
      category: dto.category,
      quantity: dto.quantity,
    });
  }

  async findByUser(userId: string) {
    return this.foodLogModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async remove(id: string) {
    const log = await this.foodLogModel.findById(id);
    if (!log) throw new NotFoundException('Food log not found');

    await this.foodLogModel.deleteOne({ _id: id });
    return { message: 'Food log removed' };
  }
}
