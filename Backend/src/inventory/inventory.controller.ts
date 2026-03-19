import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('api/v1/inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getStock(@Query() query: any) {
    return this.inventoryService.getStock(query);
  }

  @Get('movements')
  getMovements(@Query() query: any) {
    return this.inventoryService.getMovements(query);
  }

  @Post('adjust')
  adjust(@Body() body: any, @CurrentUser() user: User) {
    return this.inventoryService.adjust({ ...body, userId: user.id, userName: user.name });
  }
}
