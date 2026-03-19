import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class WarehousesService {
  constructor(@InjectRepository(Warehouse) private readonly repo: Repository<Warehouse>) {}

  async findAll(query: PaginationQuery) {
    const qb = this.repo.createQueryBuilder('w');
    if (query.search) {
      qb.where('(w.nameAr LIKE :s OR w.code LIKE :s OR w.city LIKE :s)', { s: `%${query.search}%` });
    }
    qb.orderBy('w.nameAr', 'ASC');
    return paginate(qb, query);
  }

  async findOne(id: string) {
    const w = await this.repo.findOne({ where: { id } });
    if (!w) throw new NotFoundException('المستودع غير موجود');
    return w;
  }

  async create(dto: any) {
    const exists = await this.repo.findOne({ where: { code: dto.code } });
    if (exists) throw new ConflictException('رمز المستودع موجود مسبقاً');
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: any) {
    const w = await this.findOne(id);
    Object.assign(w, dto);
    return this.repo.save(w);
  }
}
