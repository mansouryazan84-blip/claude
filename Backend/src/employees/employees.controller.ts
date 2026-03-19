import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/v1/employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}
  @Get()    findAll(@Query() q: any)                                   { return this.employeesService.findAll(q); }
  @Get('attendance') getAttendance()                                   { return this.employeesService.getTodayAttendance(); }
  @Get(':id') findOne(@Param('id') id: string)                        { return this.employeesService.findOne(id); }
  @Post()   create(@Body() body: any)                                  { return this.employeesService.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any)    { return this.employeesService.update(id, body); }
}
