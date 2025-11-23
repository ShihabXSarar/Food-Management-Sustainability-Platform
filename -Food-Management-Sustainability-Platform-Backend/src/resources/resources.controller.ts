import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async create(@Body() dto: CreateResourceDto) {
    return this.resourcesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.resourcesService.findAll();
  }

  @Get('category')
  async findByCategory(@Query('name') name: string) {
    return this.resourcesService.findByCategory(name);
  }

  @Post('seed')
  async seed() {
    return this.resourcesService.seed();
  }
}
