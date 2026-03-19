import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { paginate, PaginationQuery } from '../common/pagination';

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private readonly repo: Repository<Employee>) {}

  async findAll(query: PaginationQuery & { department?: string; status?: string; warehouseId?: string }) {
    const qb = this.repo.createQueryBuilder('e');
    if (query.department) qb.andWhere('e.department = :dep', { dep: query.department });
    if (query.status) qb.andWhere('e.status = :st', { st: query.status });
    if (query.warehouseId) qb.andWhere('e.warehouseId = :wid', { wid: query.warehouseId });
    if (query.search) {
      qb.andWhere('(e.nameAr LIKE :s OR e.employeeNo LIKE :s OR e.role LIKE :s OR e.department LIKE :s)', { s: `%${query.search}%` });
    }
    qb.orderBy('e.nameAr', 'ASC');
    return paginate(qb, query);
  }

  async findOne(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('الموظف غير موجود');
    return e;
  }

  async create(dto: any) {
    const exists = await this.repo.findOne({ where: { employeeNo: dto.employeeNo } });
    if (exists) throw new ConflictException('رقم الموظف موجود مسبقاً');
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: any) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async getTodayAttendance() {
    // Returns all active employees with a "present" stub
    // Replace with real attendance table query when available
    const employees = await this.repo.find({ where: { status: 'active' }, order: { nameAr: 'ASC' } });
    return employees.map((emp, i) => ({
      id: `att-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.nameAr,
      role: emp.role,
      department: emp.department,
      date: new Date().toISOString().split('T')[0],
      checkIn: `0${7 + (i % 3)}:${i % 2 === 0 ? '00' : '30'}`,
      checkOut: i < 3 ? `${16 + (i % 2)}:00` : null,
      status: i % 6 === 0 ? 'late' : 'present',
    }));
  }
}
