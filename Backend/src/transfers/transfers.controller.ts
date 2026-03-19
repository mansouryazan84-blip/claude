import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('api/v1/transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  findAll(@Query() q: any) { return this.transfersService.findAll(q); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.transfersService.findOne(id); }

  @Post()
  create(@Body() body: any, @CurrentUser() user: User) { return this.transfersService.create(body, user); }

  @Post(':id/approve')
  approve(@Param('id') id: string, @CurrentUser() user: User) { return this.transfersService.approve(id, user); }

  @Post(':id/complete')
  complete(@Param('id') id: string, @CurrentUser() user: User) { return this.transfersService.complete(id, user); }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) { return this.transfersService.cancel(id); }
}
