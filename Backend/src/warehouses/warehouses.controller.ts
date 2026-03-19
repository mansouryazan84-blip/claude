import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/v1/warehouses')
@UseGuards(JwtAuthGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}
  @Get() findAll(@Query() q: any) { return this.warehousesService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.warehousesService.findOne(id); }
  @Post() create(@Body() body: any) { return this.warehousesService.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.warehousesService.update(id, body); }
}
