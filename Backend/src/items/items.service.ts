import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { ItemCategory } from './item-category.entity';
import { UnitConversion } from './unit-conversion.entity';
import { WarehouseStock } from '../inventory/warehouse-stock.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    @InjectRepository(ItemCategory) private readonly catRepo: Repository<ItemCategory>,
    @InjectRepository(UnitConversion) private readonly convRepo: Repository<UnitConversion>,
    @InjectRepository(WarehouseStock) private readonly stockRepo: Repository<WarehouseStock>,
  ) {}

  async findAll(query: PaginationQuery & { categoryId?: string; status?: string; storageType?: string }) {
    const qb = this.itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.subCategory', 'subCategory')
      .leftJoinAndSelect('item.unitConversions', 'unitConversions');

    if (query.search) {
      qb.andWhere(
        '(item.nameAr LIKE :s OR item.nameEn LIKE :s OR item.sku LIKE :s OR item.barcode LIKE :s OR item.brand LIKE :s)',
        { s: `%${query.search}%` },
      );
    }
    if (query.categoryId) qb.andWhere('item.categoryId = :cid', { cid: query.categoryId });
    if (query.status) qb.andWhere('item.status = :st', { st: query.status });
    if (query.storageType) qb.andWhere('item.storageType = :stype', { stype: query.storageType });

    qb.orderBy('item.nameAr', 'ASC');

    const result = await paginate(qb, query);

    // Attach current stock totals
    const itemIds = result.data.map((i: any) => i.id);
    if (itemIds.length > 0) {
      const stocks = await this.stockRepo
        .createQueryBuilder('ws')
        .select('ws.itemId', 'itemId')
        .addSelect('SUM(ws.quantity)', 'total')
        .where('ws.itemId IN (:...ids)', { ids: itemIds })
        .groupBy('ws.itemId')
        .getRawMany();

      const stockMap = new Map(stocks.map((s) => [s.itemId, Number(s.total)]));
      result.data.forEach((item: any) => {
        item.currentStock = stockMap.get(item.id) ?? 0;
      });
    }

    return result;
  }

  async findOne(id: string) {
    const item = await this.itemRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'unitConversions'],
    });
    if (!item) throw new NotFoundException('الصنف غير موجود');

    const stockRows = await this.stockRepo.find({
      where: { itemId: id },
      relations: ['warehouse'],
    });
    const currentStock = stockRows.reduce((s, r) => s + Number(r.quantity), 0);

    return { ...item, currentStock, stockByWarehouse: stockRows };
  }

  async create(dto: any) {
    const exists = await this.itemRepo.findOne({ where: { sku: dto.sku } });
    if (exists) throw new ConflictException('رمز الصنف (SKU) موجود مسبقاً');

    const { unitConversions, ...itemData } = dto;
    const item = this.itemRepo.create(itemData);
    const saved = (await this.itemRepo.save(item)) as unknown as Item;

    if (unitConversions?.length) {
      const convs = unitConversions.map((c: any) =>
        this.convRepo.create({ ...c, itemId: saved.id }),
      );
      await this.convRepo.save(convs);
    }

    return this.findOne(saved.id);
  }

  async update(id: string, dto: any) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('الصنف غير موجود');

    const { unitConversions, ...itemData } = dto;
    Object.assign(item, itemData);
    await this.itemRepo.save(item);

    if (unitConversions !== undefined) {
      await this.convRepo.delete({ itemId: id });
      if (unitConversions.length) {
        const convs = unitConversions.map((c: any) =>
          this.convRepo.create({ ...c, itemId: id }),
        );
        await this.convRepo.save(convs);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('الصنف غير موجود');
    await this.itemRepo.remove(item);
    return { message: 'تم حذف الصنف بنجاح' };
  }

  async getCategories() {
    return this.catRepo.find({
      relations: ['parent', 'children'],
      order: { nameAr: 'ASC' },
    });
  }

  async createCategory(dto: { nameAr: string; nameEn?: string; parentId?: string; color?: string }) {
    const cat = this.catRepo.create(dto);
    return this.catRepo.save(cat);
  }
}
