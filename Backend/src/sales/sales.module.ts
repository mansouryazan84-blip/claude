import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesOrder, SalesOrderLine } from './sales-order.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { StockMovement } from '../inventory/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder, SalesOrderLine, WarehouseStock, StockMovement])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
