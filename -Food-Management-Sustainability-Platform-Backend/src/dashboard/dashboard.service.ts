import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  Inventory,
  InventoryDocument,
} from '../inventory/schemas/inventory.schema';
import { FoodLog, FoodLogDocument } from '../food-log/schemas/food-log.schema';
import {
  Resource,
  ResourceDocument,
} from '../resources/schemas/resource.schema';
import { DashboardStatsDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Inventory.name)
    private inventoryModel: Model<InventoryDocument>,
    @InjectModel(FoodLog.name) private foodLogModel: Model<FoodLogDocument>,
    @InjectModel(Resource.name) private resourceModel: Model<ResourceDocument>,
  ) {}

  async getUserDashboard(userId: string): Promise<DashboardStatsDto> {
    // User profile
    const profile = await this.userModel
      .findById(userId)
      .select('-password')
      .lean();

    // Inventory summary
    const inventory = await this.inventoryModel
      .find({ user: userId })
      .populate('item')
      .lean();
    const totalItems = inventory.length;

    const today = new Date();
    const expiringSoon = inventory.filter((inv) => {
      return (
        inv.expiryDate &&
        new Date(inv.expiryDate).getTime() - today.getTime() <= 3 * 86400000
      );
    }).length;

    // Recent logs (last 5)
    const recentLogs = await this.foodLogModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Recommendation logic
    const usedCategories = [...new Set(recentLogs.map((log) => log.category))];
let recommended: { title: string; category: string; reason: string }[] = [];

if (usedCategories.length > 0) {
  const resources = await this.resourceModel
    .find({ category: { $in: usedCategories } })
    .lean();

  recommended = resources.map((r) => ({
    title: r.title,
    category: r.category,
    reason: `Related to: ${r.category} category`,
  }));
}

    return {
      profile,
      inventorySummary: {
        totalItems,
        expiringSoon,
      },
      recentLogs,
      recommendedResources: recommended,
    };
  }
}
