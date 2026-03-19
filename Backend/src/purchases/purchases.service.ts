import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseOrder, PurchaseOrderLine } from './purchase-order.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { StockMovement } from '../inventory/stock-movement.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(PurchaseOrder) private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLine) private readonly lineRepo: Repository<PurchaseOrderLine>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: PaginationQuery & { status?: string }) {
    const qb = this.poRepo.createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier')
      .leftJoinAndSelect('po.warehouse', 'warehouse');
    if (query.status) qb.where('po.status = :status', { status: query.status });
    if (query.search) qb.andWhere('(po.orderNo LIKE :s OR supplier.nameAr LIKE :s)', { s: `%${query.search}%` });
    qb.orderBy('po.createdAt', 'DESC');
    return paginate(qb, query);
  }

  async findOne(id: string) {
    const po = await this.poRepo.findOne({ where: { id }, relations: ['supplier', 'warehouse', 'lines'] });
    if (!po) throw new NotFoundException('أمر الشراء غير موجود');
    return po;
  }

  async create(dto: any, user: { id: string; name: string }) {
    const orderNo = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    return this.dataSource.transaction(async (em) => {
      const { lines, ...orderData } = dto;
      const po = em.create(PurchaseOrder, { ...orderData, orderNo, status: 'draft', createdById: user.id, createdByName: user.name });
      const saved = await em.save(PurchaseOrder, po);
      if (lines?.length) {
        const poLines = lines.map((l: any) => em.create(PurchaseOrderLine, { ...l, orderId: saved.id }));
        await em.save(PurchaseOrderLine, poLines);
      }
      return this.findOne(saved.id);
    });
  }

  async approve(id: string, user: { id: string; name: string }) {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) throw new NotFoundException('أمر الشراء غير موجود');
    if (!['draft', 'pending'].includes(po.status)) throw new BadRequestException('لا يمكن اعتماد هذا الأمر');
    po.status = 'approved';
    return this.poRepo.save(po);
  }

  async receive(id: string, dto: { lines: { lineId: string; qty: number }[] }, user: { id: string; name: string }) {
    return this.dataSource.transaction(async (em) => {
      const po = await em.findOne(PurchaseOrder, { where: { id }, relations: ['lines'] });
      if (!po) throw new NotFoundException('أمر الشراء غير موجود');
      if (!['approved', 'partial'].includes(po.status)) throw new BadRequestException('الأمر غير معتمد للاستلام');

      for (const recv of dto.lines) {
        const line = po.lines.find(l => l.id === recv.lineId);
        if (!line) continue;
        line.receivedQty = Number(line.receivedQty) + recv.qty;
        await em.save(PurchaseOrderLine, line);

        // Add to stock
        let stock = await em.findOne(WarehouseStock, { where: { warehouseId: po.warehouseId, itemId: line.itemId } });
        if (!stock) stock = em.create(WarehouseStock, { warehouseId: po.warehouseId, itemId: line.itemId, quantity: 0 });
        stock.quantity = Number(stock.quantity) + recv.qty;
        await em.save(WarehouseStock, stock);

        // Stock movement
        const mv = em.create(StockMovement, {
          referenceNo: `RCV-${id.slice(0,8)}-${Date.now()}`,
          type: 'in', status: 'completed',
          itemId: line.itemId, toWarehouseId: po.warehouseId,
          quantity: recv.qty, unit: line.unit,
          requestedById: user.id, requestedByName: user.name,
          approvedById: user.id, approvedByName: user.name,
        });
        await em.save(StockMovement, mv);
      }

      const allReceived = po.lines.every(l => Number(l.receivedQty) >= Number(l.orderedQty));
      po.status = allReceived ? 'completed' : 'partial';
      await em.save(PurchaseOrder, po);
      return this.findOne(id);
    });
  }
}
