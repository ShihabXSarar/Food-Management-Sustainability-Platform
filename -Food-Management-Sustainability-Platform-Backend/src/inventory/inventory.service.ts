import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { FoodItemsService } from '../food-items/food-items.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
    private foodItemsService: FoodItemsService,
  ) { }

  // Add inventory
  async add(userId: string, dto: CreateInventoryDto) {
    let itemId = dto.item;

    // If item is not a valid ObjectId, treat it as a name and find/create FoodItem
    if (!Types.ObjectId.isValid(dto.item)) {
      let foodItem = await this.foodItemsService.findByName(dto.item);

      if (!foodItem) {
        // Create new food item with defaults
        // Calculate expiration days from dto.expiryDate if possible, else default 7
        let days = 7;
        if (dto.expiryDate) {
          const diff = new Date(dto.expiryDate).getTime() - Date.now();
          days = Math.ceil(diff / (1000 * 60 * 60 * 24));
          if (days < 1) days = 1;
        }

        foodItem = await this.foodItemsService.create({
          name: dto.item,
          category: 'Uncategorized', // We could pass category if DTO allowed it
          expirationDays: days,
          costPerUnit: 0,
        });
      }
      itemId = (foodItem as any)._id;
    }

    return this.inventoryModel.create({
      user: userId,
      item: itemId,
      quantity: dto.quantity,
      expiryDate: dto.expiryDate,
    });
  }

  // Get user inventory
  async findByUser(userId: string) {
    return this.inventoryModel.find({ user: userId }).populate('item').lean();
  }

  // Remove from inventory
  async remove(id: string) {
    const inv = await this.inventoryModel.findById(id);
    if (!inv) throw new NotFoundException('Inventory item not found');

    await this.inventoryModel.deleteOne({ _id: id });
    return { message: 'Inventory item removed' };
  }
}
