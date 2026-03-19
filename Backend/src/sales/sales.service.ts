import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalesOrder, SalesOrderLine } from './sales-order.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { StockMovement } from '../inventory/stock-movement.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SalesOrder) private readonly soRepo: Repository<SalesOrder>,
    @InjectRepository(SalesOrderLine) private readonly lineRepo: Repository<SalesOrderLine>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: PaginationQuery & { status?: string }) {
    const qb = this.soRepo.createQueryBuilder('so')
      .leftJoinAndSelect('so.customer', 'customer')
      .leftJoinAndSelect('so.warehouse', 'warehouse');
    if (query.status) qb.where('so.status = :status', { status: query.status });
    if (query.search) qb.andWhere('(so.orderNo LIKE :s OR customer.nameAr LIKE :s)', { s: `%${query.search}%` });
    qb.orderBy('so.createdAt', 'DESC');
    return paginate(qb, query);
  }

  async findOne(id: string) {
    const so = await this.soRepo.findOne({ where: { id }, relations: ['customer', 'warehouse', 'lines'] });
    if (!so) throw new NotFoundException('أمر البيع غير موجود');
    return so;
  }

  async create(dto: any, user: { id: string; name: string }) {
    const orderNo = `SO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    return this.dataSource.transaction(async (em) => {
      const { lines, ...orderData } = dto;
      const so = em.create(SalesOrder, { ...orderData, orderNo, status: 'draft', createdById: user.id, createdByName: user.name });
      const saved = await em.save(SalesOrder, so);
      if (lines?.length) {
        const soLines = lines.map((l: any) => em.create(SalesOrderLine, { ...l, orderId: saved.id }));
        await em.save(SalesOrderLine, soLines);
      }
      return this.findOne(saved.id);
    });
  }

  async approve(id: string, user: { id: string; name: string }) {
    return this.dataSource.transaction(async (em) => {
      const so = await em.findOne(SalesOrder, { where: { id }, relations: ['lines'] });
      if (!so) throw new NotFoundException('أمر البيع غير موجود');
      if (!['draft', 'pending'].includes(so.status)) throw new BadRequestException('لا يمكن اعتماد هذا الأمر');

      // Check and deduct stock
      for (const line of so.lines) {
        const stock = await em.findOne(WarehouseStock, { where: { warehouseId: so.warehouseId, itemId: line.itemId } });
        if (!stock || Number(stock.quantity) < Number(line.qty)) {
          throw new BadRequestException(`الكمية غير كافية للصنف: ${line.itemName}`);
        }
        stock.quantity = Number(stock.quantity) - Number(line.qty);
        await em.save(WarehouseStock, stock);

        const mv = em.create(StockMovement, {
          referenceNo: `OUT-${id.slice(0,8)}-${Date.now()}`,
          type: 'out', status: 'completed',
          itemId: line.itemId, fromWarehouseId: so.warehouseId,
          quantity: line.qty, unit: line.unit,
          requestedById: user.id, requestedByName: user.name,
          approvedById: user.id, approvedByName: user.name,
        });
        await em.save(StockMovement, mv);
      }

      so.status = 'completed';
      return em.save(SalesOrder, so);
    });
  }
}
