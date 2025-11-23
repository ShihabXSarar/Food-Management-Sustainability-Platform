import { Controller, Get, Post, Body, Query, Param, HttpException, Delete, HttpStatus } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';

@Controller('food-items')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  // Create manually
  @Post()
  async create(@Body() dto: CreateFoodItemDto) {
    return this.foodItemsService.create(dto);
  }

  // Get all
  @Get()
  async findAll() {
    return this.foodItemsService.findAll();
  }

  // Filter by category
  @Get('category')
  async findByCategory(@Query('name') name: string) {
    return this.foodItemsService.findByCategory(name);
  }

  // Seed
  @Post('seed')
  async seed() {
    return this.foodItemsService.seed();
  }

  //get by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.foodItemsService.findOne(id);
  }

  @Delete(':id')
  async deleteFoodItem(@Param('id') id: string) {
    try {
      return await this.foodItemsService.remove(id);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }
}
