import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('api/v1/purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}
  @Get()    findAll(@Query() q: any)                              { return this.purchasesService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string)                   { return this.purchasesService.findOne(id); }
  @Post()   create(@Body() body: any, @CurrentUser() u: User)    { return this.purchasesService.create(body, u); }
  @Post(':id/approve') approve(@Param('id') id: string, @CurrentUser() u: User) { return this.purchasesService.approve(id, u); }
  @Post(':id/receive') receive(@Param('id') id: string, @Body() body: any, @CurrentUser() u: User) { return this.purchasesService.receive(id, body, u); }
}
