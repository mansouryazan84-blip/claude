import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ItemCategory } from './item-category.entity';
import { UnitConversion } from './unit-conversion.entity';

export type StorageType = 'dry' | 'refrigerated' | 'frozen' | 'controlled';
export type ItemStatus = 'active' | 'discontinued' | 'pending_approval';
export type ItemUnit = 'kg' | 'gram' | 'ton' | 'liter' | 'ml' | 'piece' | 'box' | 'carton' | 'bag' | 'pallet' | 'barrel' | 'can';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  sku: string;

  @Column({ nullable: true, length: 50 })
  barcode: string;

  @Column({ name: 'name_ar', length: 150 })
  nameAr: string;

  @Column({ name: 'name_en', length: 150, nullable: true })
  nameEn: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => ItemCategory)
  @JoinColumn({ name: 'category_id' })
  category: ItemCategory;

  @Column({ name: 'sub_category_id', nullable: true })
  subCategoryId: string;

  @ManyToOne(() => ItemCategory, { nullable: true })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: ItemCategory;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({ name: 'storage_type', type: 'enum', enum: ['dry','refrigerated','frozen','controlled'], default: 'dry' })
  storageType: StorageType;

  @Column({ name: 'base_unit', type: 'enum', enum: ['kg','gram','ton','liter','ml','piece','box','carton','bag','pallet','barrel','can'], default: 'piece' })
  baseUnit: ItemUnit;

  @Column({ name: 'weight_per_unit', type: 'decimal', precision: 10, scale: 3, nullable: true })
  weightPerUnit: number;

  @Column({ name: 'volume_per_unit', type: 'decimal', precision: 10, scale: 3, nullable: true })
  volumePerUnit: number;

  @Column({ name: 'shelf_life_days', nullable: true })
  shelfLifeDays: number;

  @Column({ name: 'minimum_stock', type: 'decimal', precision: 12, scale: 3, default: 0 })
  minimumStock: number;

  @Column({ name: 'maximum_stock', type: 'decimal', precision: 12, scale: 3, nullable: true })
  maximumStock: number;

  @Column({ name: 'reorder_point', type: 'decimal', precision: 12, scale: 3, default: 0 })
  reorderPoint: number;

  @Column({ name: 'is_batch_tracked', default: false })
  isBatchTracked: boolean;

  @Column({ name: 'is_serial_tracked', default: false })
  isSerialTracked: boolean;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate: number;

  @Column({ type: 'enum', enum: ['active','discontinued','pending_approval'], default: 'active' })
  status: ItemStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => UnitConversion, u => u.item, { cascade: true })
  unitConversions: UnitConversion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
