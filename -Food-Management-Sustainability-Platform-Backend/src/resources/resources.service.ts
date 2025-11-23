import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource, ResourceDocument } from './schemas/resource.schema';
import { CreateResourceDto } from './dto/create-resource.dto';
import { RESOURCES_SEED } from './seed/resources.seed';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name)
    private resourceModel: Model<ResourceDocument>,
  ) {}

  async create(dto: CreateResourceDto): Promise<Resource> {
    return this.resourceModel.create(dto);
  }

  async findAll(): Promise<Resource[]> {
    return this.resourceModel.find().lean();
  }

  async findByCategory(category: string): Promise<Resource[]> {
    return this.resourceModel.find({ category }).lean();
  }

  async seed() {
    const count = await this.resourceModel.countDocuments();

    if (count > 0) {
      return { message: 'Resources already seeded.' };
    }

    await this.resourceModel.insertMany(RESOURCES_SEED);

    return { message: 'Resources seeding completed.' };
  }
}
