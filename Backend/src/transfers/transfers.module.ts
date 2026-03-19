import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { StockMovement } from '../inventory/stock-movement.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement, WarehouseStock])],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
