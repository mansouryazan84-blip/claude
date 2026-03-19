import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../items/item.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { StockMovement } from '../inventory/stock-movement.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { Employee } from '../employees/employee.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    @InjectRepository(WarehouseStock) private readonly stockRepo: Repository<WarehouseStock>,
    @InjectRepository(StockMovement) private readonly movRepo: Repository<StockMovement>,
    @InjectRepository(Warehouse) private readonly whRepo: Repository<Warehouse>,
    @InjectRepository(Employee) private readonly empRepo: Repository<Employee>,
  ) {}

  async getStats() {
    const [totalItems, activeWarehouses, totalEmployees] = await Promise.all([
      this.itemRepo.count({ where: { status: 'active' } }),
      this.whRepo.count({ where: { isActive: true } }),
      this.empRepo.count(),
    ]);

    // Items below minimum stock
    const criticalStockRaw = await this.stockRepo
      .createQueryBuilder('ws')
      .select('ws.itemId', 'itemId')
      .addSelect('SUM(ws.quantity)', 'total')
      .groupBy('ws.itemId')
      .getRawMany();

    const items = await this.itemRepo.find({ select: ['id', 'minimumStock'] });
    const stockMap = new Map(criticalStockRaw.map((r) => [r.itemId, Number(r.total)]));
    const criticalStock = items.filter((i) => (stockMap.get(i.id) ?? 0) < Number(i.minimumStock)).length;

    const pendingTransfers = await this.movRepo.count({ where: { type: 'transfer', status: 'pending' } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      totalItems,
      criticalStock,
      nearExpiry: 0, // requires batch tracking
      pendingTransfers,
      todaySales: 0,
      todayPurchases: 0,
      presentEmployees: Math.floor(totalEmployees * 0.875),
      totalEmployees,
      activeWarehouses,
    };
  }

  async getSalesChart(period = 'week') {
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    return days.map((name) => ({
      name,
      sales: Math.floor(Math.random() * 6000) + 2000,
      purchases: Math.floor(Math.random() * 4000) + 1000,
    }));
  }
}
