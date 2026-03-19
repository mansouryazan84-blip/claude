import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class ContactsService {
  constructor(@InjectRepository(Contact) private readonly repo: Repository<Contact>) {}

  async findAll(query: PaginationQuery & { type?: string }) {
    const qb = this.repo.createQueryBuilder('c');
    if (query.type) qb.where('c.type = :type', { type: query.type });
    if (query.search) {
      qb.andWhere('(c.nameAr LIKE :s OR c.code LIKE :s OR c.city LIKE :s OR c.phone LIKE :s OR c.email LIKE :s)', { s: `%${query.search}%` });
    }
    qb.orderBy('c.nameAr', 'ASC');
    return paginate(qb, query);
  }

  async findOne(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('جهة الاتصال غير موجودة');
    return c;
  }

  async create(dto: any) {
    const exists = await this.repo.findOne({ where: { code: dto.code } });
    if (exists) throw new ConflictException('الرمز موجود مسبقاً');
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: any) {
    const c = await this.findOne(id);
    Object.assign(c, dto);
    return this.repo.save(c);
  }

  async remove(id: string) {
    const c = await this.findOne(id);
    await this.repo.remove(c);
    return { message: 'تم الحذف بنجاح' };
  }
}
