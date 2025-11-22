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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Add item

  @Post()
  async add(@Req() req, @Body() dto: CreateInventoryDto) {
    const userId =
      req.user?.id || req.user?._id || req.user?.sub || req.user?.userId;

    return this.inventoryService.add(userId, dto);
  }

  // Get user inventory
  @Get()
  async list(@Req() req) {
    const userId =
      req.user?.id || req.user?._id || req.user?.sub || req.user?.userId;

    return this.inventoryService.findByUser(userId);
  }
  // Remove item
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
