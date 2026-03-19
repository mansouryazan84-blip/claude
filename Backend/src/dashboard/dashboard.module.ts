import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Item } from '../items/item.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { StockMovement } from '../inventory/stock-movement.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Employee } from '../employees/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, WarehouseStock, StockMovement, Warehouse, Employee])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
