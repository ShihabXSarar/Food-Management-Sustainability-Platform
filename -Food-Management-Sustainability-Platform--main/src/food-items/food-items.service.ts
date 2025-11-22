import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FoodItem, FoodItemDocument } from './schemas/food-item.schema';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { FOOD_ITEMS_SEED } from './seed/food-items.seed';

@Injectable()
export class FoodItemsService {
  constructor(
    @InjectModel(FoodItem.name)
    private foodItemModel: Model<FoodItemDocument>,
  ) {}

  // Create manually (optional)
  async create(dto: CreateFoodItemDto): Promise<FoodItem> {
    return this.foodItemModel.create(dto);
  }

  // List all items
  async findAll(): Promise<FoodItem[]> {
    return this.foodItemModel.find().lean();
  }

  // Find by category
  async findByCategory(category: string): Promise<FoodItem[]> {
    return this.foodItemModel.find({ category }).lean();
  }

  // Seed items (only run once)
  async seed() {
    const count = await this.foodItemModel.countDocuments();
    if (count > 0) {
      return { message: 'Food items already seeded.' };
    }

    await this.foodItemModel.insertMany(FOOD_ITEMS_SEED);
    return { message: 'Food items seeding completed.' };
  }

  async findOne(id: string): Promise<FoodItem | null> {
    return await this.foodItemModel.findById(id).lean();
  }

  // FoodItemsService
  async remove(id: string): Promise<{ message: string }> {
    const item = await this.foodItemModel.findById(id);
    if (!item) {
      throw new Error('Food item not found');
    }
    await this.foodItemModel.deleteOne({ _id: id });
    return { message: 'Food item deleted successfully' };
  }
}
