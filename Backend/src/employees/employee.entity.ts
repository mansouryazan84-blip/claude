import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_no', unique: true, length: 30 })
  employeeNo: string;

  @Column({ name: 'name_ar', length: 150 })
  nameAr: string;

  @Column({ name: 'name_en', length: 150, nullable: true })
  nameEn: string;

  @Column({ length: 100 })
  role: string;

  @Column({ length: 100 })
  department: string;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @Column({ name: 'warehouse_name', length: 150, nullable: true })
  warehouseName: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({ type: 'enum', enum: ['active','on_leave','terminated'], default: 'active' })
  status: EmployeeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
