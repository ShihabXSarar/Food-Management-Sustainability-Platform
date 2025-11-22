import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
  ) {}

  // Add inventory
  async add(userId: string, dto: CreateInventoryDto) {
    return this.inventoryModel.create({
      user: userId,
      item: dto.item,
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
