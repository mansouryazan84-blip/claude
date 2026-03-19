import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/v1/contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  @Get()    findAll(@Query() q: any)                     { return this.contactsService.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string)           { return this.contactsService.findOne(id); }
  @Post()   create(@Body() body: any)                    { return this.contactsService.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.contactsService.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string)         { return this.contactsService.remove(id); }
}
