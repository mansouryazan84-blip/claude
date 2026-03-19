import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item } from './item.entity';
import { ItemCategory } from './item-category.entity';
import { UnitConversion } from './unit-conversion.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemCategory, UnitConversion, WarehouseStock])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
