import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type WarehouseType = 'main' | 'branch' | 'transit' | 'cold_storage';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 30 })
  code: string;

  @Column({ name: 'name_ar', length: 150 })
  nameAr: string;

  @Column({ name: 'name_en', length: 150, nullable: true })
  nameEn: string;

  @Column({ type: 'enum', enum: ['main','branch','transit','cold_storage'], default: 'branch' })
  type: WarehouseType;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  capacity: number;

  @Column({ name: 'used_capacity', type: 'decimal', precision: 15, scale: 2, default: 0 })
  usedCapacity: number;

  @Column({ name: 'manager_id', nullable: true })
  managerId: string;

  @Column({ name: 'manager_name', length: 150, nullable: true })
  managerName: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
