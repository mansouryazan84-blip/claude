import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/v1/fleet')
@UseGuards(JwtAuthGuard)
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}
  @Get()    findAll(@Query() q: any)                                 { return this.fleetService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string)                      { return this.fleetService.findOne(id); }
  @Post()   create(@Body() body: any)                                { return this.fleetService.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any)  { return this.fleetService.update(id, body); }
}
