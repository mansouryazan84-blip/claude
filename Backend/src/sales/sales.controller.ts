import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('api/v1/sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Get()    findAll(@Query() q: any)                            { return this.salesService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string)                 { return this.salesService.findOne(id); }
  @Post()   create(@Body() body: any, @CurrentUser() u: User)  { return this.salesService.create(body, u); }
  @Post(':id/approve') approve(@Param('id') id: string, @CurrentUser() u: User) { return this.salesService.approve(id, u); }
}
