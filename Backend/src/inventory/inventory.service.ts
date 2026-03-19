import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WarehouseStock } from './warehouse-stock.entity';
import { StockMovement } from './stock-movement.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(WarehouseStock) private readonly stockRepo: Repository<WarehouseStock>,
    @InjectRepository(StockMovement) private readonly movementRepo: Repository<StockMovement>,
    private readonly dataSource: DataSource,
  ) {}

  async getStock(query: PaginationQuery & { warehouseId?: string; itemId?: string }) {
    const qb = this.stockRepo
      .createQueryBuilder('ws')
      .leftJoinAndSelect('ws.item', 'item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('ws.warehouse', 'warehouse')
      .where('ws.quantity > 0');

    if (query.warehouseId) qb.andWhere('ws.warehouseId = :wid', { wid: query.warehouseId });
    if (query.itemId) qb.andWhere('ws.itemId = :iid', { iid: query.itemId });
    if (query.search) {
      qb.andWhere('(item.nameAr LIKE :s OR item.sku LIKE :s)', { s: `%${query.search}%` });
    }

    qb.orderBy('item.nameAr', 'ASC');
    return paginate(qb, query);
  }

  async getMovements(query: PaginationQuery & { type?: string; status?: string; warehouseId?: string }) {
    const qb = this.movementRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.item', 'item')
      .leftJoinAndSelect('m.fromWarehouse', 'fromWarehouse')
      .leftJoinAndSelect('m.toWarehouse', 'toWarehouse');

    if (query.type) qb.andWhere('m.type = :type', { type: query.type });
    if (query.status) qb.andWhere('m.status = :status', { status: query.status });
    if (query.warehouseId) {
      qb.andWhere('(m.fromWarehouseId = :wid OR m.toWarehouseId = :wid)', { wid: query.warehouseId });
    }
    if (query.search) {
      qb.andWhere('(m.referenceNo LIKE :s OR item.nameAr LIKE :s)', { s: `%${query.search}%` });
    }

    qb.orderBy('m.createdAt', 'DESC');
    return paginate(qb, query);
  }

  async adjust(dto: { itemId: string; warehouseId: string; quantity: number; notes?: string; userId: string; userName: string }) {
    return this.dataSource.transaction(async (em) => {
      let stock = await em.findOne(WarehouseStock, {
        where: { itemId: dto.itemId, warehouseId: dto.warehouseId },
      });

      if (!stock) {
        stock = em.create(WarehouseStock, {
          itemId: dto.itemId,
          warehouseId: dto.warehouseId,
          quantity: 0,
        });
      }

      const refNo = `ADJ-${Date.now()}`;
      stock.quantity = Number(stock.quantity) + dto.quantity;
      if (stock.quantity < 0) throw new BadRequestException('الكمية لا يمكن أن تكون سالبة');

      await em.save(WarehouseStock, stock);

      const movement = em.create(StockMovement, {
        referenceNo: refNo,
        type: 'adjustment',
        status: 'completed',
        itemId: dto.itemId,
        toWarehouseId: dto.quantity > 0 ? dto.warehouseId : undefined,
        fromWarehouseId: dto.quantity < 0 ? dto.warehouseId : undefined,
        quantity: Math.abs(dto.quantity),
        unit: 'piece',
        notes: dto.notes,
        requestedById: dto.userId,
        requestedByName: dto.userName,
        approvedById: dto.userId,
        approvedByName: dto.userName,
      });
      await em.save(StockMovement, movement);

      return { stock, movement };
    });
  }
}
