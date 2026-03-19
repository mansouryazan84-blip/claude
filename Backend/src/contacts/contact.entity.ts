import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type ContactType = 'supplier' | 'customer';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['supplier', 'customer'] })
  type: ContactType;

  @Column({ unique: true, length: 30 })
  code: string;

  @Column({ name: 'name_ar', length: 200 })
  nameAr: string;

  @Column({ name: 'name_en', length: 200, nullable: true })
  nameEn: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ name: 'tax_number', length: 50, nullable: true })
  taxNumber: string;

  @Column({ name: 'credit_limit', type: 'decimal', precision: 15, scale: 2, nullable: true })
  creditLimit: number;

  @Column({ name: 'payment_terms', nullable: true, comment: 'days' })
  paymentTerms: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ name: 'total_purchases', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPurchases: number;

  @Column({ name: 'total_sales', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalSales: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
