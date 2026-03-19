import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockMovement } from '../inventory/stock-movement.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(StockMovement) private readonly movRepo: Repository<StockMovement>,
    @InjectRepository(WarehouseStock) private readonly stockRepo: Repository<WarehouseStock>,
    private readonly dataSource: DataSource,
  ) {}

  private baseQuery() {
    return this.movRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.item', 'item')
      .leftJoinAndSelect('m.fromWarehouse', 'fromWarehouse')
      .leftJoinAndSelect('m.toWarehouse', 'toWarehouse')
      .where('m.type = :type', { type: 'transfer' });
  }

  async findAll(query: PaginationQuery & { status?: string; warehouseId?: string }) {
    const qb = this.baseQuery();
    if (query.status) qb.andWhere('m.status = :status', { status: query.status });
    if (query.warehouseId) {
      qb.andWhere('(m.fromWarehouseId = :wid OR m.toWarehouseId = :wid)', { wid: query.warehouseId });
    }
    if (query.search) {
      qb.andWhere('(m.referenceNo LIKE :s OR item.nameAr LIKE :s OR m.driverName LIKE :s)', { s: `%${query.search}%` });
    }
    qb.orderBy('m.createdAt', 'DESC');
    return paginate(qb, query);
  }

  async findOne(id: string) {
    const m = await this.movRepo.findOne({ where: { id, type: 'transfer' }, relations: ['item', 'fromWarehouse', 'toWarehouse'] });
    if (!m) throw new NotFoundException('المناقلة غير موجودة');
    return m;
  }

  async create(dto: any, user: { id: string; name: string }) {
    const refNo = `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const movement = this.movRepo.create({
      ...dto,
      referenceNo: refNo,
      type: 'transfer',
      status: 'pending',
      requestedById: user.id,
      requestedByName: user.name,
    });
    return this.movRepo.save(movement);
  }

  async approve(id: string, user: { id: string; name: string }) {
    const m = await this.movRepo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('المناقلة غير موجودة');
    if (m.status !== 'pending') throw new BadRequestException('لا يمكن اعتماد هذه المناقلة');
    m.status = 'approved';
    m.approvedById = user.id;
    m.approvedByName = user.name;
    return this.movRepo.save(m);
  }

  async complete(id: string, user: { id: string; name: string }) {
    return this.dataSource.transaction(async (em) => {
      const m = await em.findOne(StockMovement, { where: { id } });
      if (!m) throw new NotFoundException('المناقلة غير موجودة');
      if (!['approved', 'in_transit'].includes(m.status)) throw new BadRequestException('لا يمكن إكمال هذه المناقلة');

      // Deduct from source
      if (m.fromWarehouseId) {
        let fromStock = await em.findOne(WarehouseStock, { where: { warehouseId: m.fromWarehouseId, itemId: m.itemId } });
        if (!fromStock || Number(fromStock.quantity) < Number(m.quantity)) {
          throw new BadRequestException('الكمية غير كافية في المستودع المصدر');
        }
        fromStock.quantity = Number(fromStock.quantity) - Number(m.quantity);
        await em.save(WarehouseStock, fromStock);
      }

      // Add to destination
      if (m.toWarehouseId) {
        let toStock = await em.findOne(WarehouseStock, { where: { warehouseId: m.toWarehouseId, itemId: m.itemId } });
        if (!toStock) {
          toStock = em.create(WarehouseStock, { warehouseId: m.toWarehouseId, itemId: m.itemId, quantity: 0 });
        }
        toStock.quantity = Number(toStock.quantity) + Number(m.quantity);
        await em.save(WarehouseStock, toStock);
      }

      m.status = 'completed';
      return em.save(StockMovement, m);
    });
  }

  async cancel(id: string) {
    const m = await this.movRepo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('المناقلة غير موجودة');
    if (m.status === 'completed') throw new BadRequestException('لا يمكن إلغاء مناقلة مكتملة');
    m.status = 'cancelled';
    return this.movRepo.save(m);
  }
}
