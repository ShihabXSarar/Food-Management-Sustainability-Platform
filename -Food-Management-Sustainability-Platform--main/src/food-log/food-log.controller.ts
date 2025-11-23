import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FoodLogService } from './food-log.service';
import { CreateFoodLogDto } from './dto/create-food-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('food-log')
export class FoodLogController {
  constructor(private readonly foodLogService: FoodLogService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateFoodLogDto) {
    const userId = req.user?.id || req.user?._id || req.user?.sub;

    return this.foodLogService.create(userId, dto);
  }

  @Get()
  async list(@Req() req) {
    const userId = req.user?.id || req.user?._id || req.user?.sub;

    return this.foodLogService.findByUser(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.foodLogService.remove(id);
  }
}
