import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PurchaseOrder, PurchaseOrderLine } from './purchase-order.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { StockMovement } from '../inventory/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, PurchaseOrderLine, WarehouseStock, StockMovement])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
