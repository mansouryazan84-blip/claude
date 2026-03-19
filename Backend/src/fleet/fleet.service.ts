import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class FleetService {
  constructor(@InjectRepository(Vehicle) private readonly repo: Repository<Vehicle>) {}

  async findAll(query: PaginationQuery & { status?: string }) {
    const qb = this.repo.createQueryBuilder('v');
    if (query.status) qb.where('v.status = :st', { st: query.status });
    if (query.search) {
      qb.andWhere('(v.plateNo LIKE :s OR v.brand LIKE :s OR v.model LIKE :s OR v.driverName LIKE :s)', { s: `%${query.search}%` });
    }
    qb.orderBy('v.plateNo', 'ASC');
    return paginate(qb, query);
  }

  async findOne(id: string) {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('المركبة غير موجودة');
    return v;
  }

  async create(dto: any) {
    const exists = await this.repo.findOne({ where: { plateNo: dto.plateNo } });
    if (exists) throw new ConflictException('رقم اللوحة موجود مسبقاً');
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: any) {
    const v = await this.findOne(id);
    Object.assign(v, dto);
    return this.repo.save(v);
  }
}
