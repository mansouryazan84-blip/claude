import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('sales_orders')
export class SalesOrder {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'order_no', unique: true, length: 50 }) orderNo: string;
  @Column({ name: 'customer_id' }) customerId: string;
  @ManyToOne(() => Contact) @JoinColumn({ name: 'customer_id' }) customer: Contact;
  @Column({ name: 'warehouse_id' }) warehouseId: string;
  @ManyToOne(() => Warehouse) @JoinColumn({ name: 'warehouse_id' }) warehouse: Warehouse;
  @Column({ type: 'enum', enum: ['draft','pending','approved','partial','completed','cancelled'], default: 'draft' }) status: string;
  @Column({ name: 'order_date', type: 'date' }) orderDate: Date;
  @Column({ name: 'delivery_date', type: 'date', nullable: true }) deliveryDate: Date;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) subtotal: number;
  @Column({ name: 'tax_total', type: 'decimal', precision: 15, scale: 2, default: 0 }) taxTotal: number;
  @Column({ name: 'discount_total', type: 'decimal', precision: 15, scale: 2, default: 0 }) discountTotal: number;
  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 2, default: 0 }) grandTotal: number;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ name: 'created_by_id' }) createdById: string;
  @Column({ name: 'created_by_name', length: 150 }) createdByName: string;
  @OneToMany(() => SalesOrderLine, l => l.order, { cascade: true }) lines: SalesOrderLine[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}

@Entity('sales_order_lines')
export class SalesOrderLine {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'order_id' }) orderId: string;
  @ManyToOne(() => SalesOrder, o => o.lines, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'order_id' }) order: SalesOrder;
  @Column({ name: 'item_id' }) itemId: string;
  @Column({ name: 'item_name', length: 200 }) itemName: string;
  @Column({ name: 'item_sku', length: 50 }) itemSku: string;
  @Column({ type: 'decimal', precision: 12, scale: 3 }) qty: number;
  @Column({ length: 20 }) unit: string;
  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 }) unitPrice: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) discount: number;
  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 }) taxRate: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) total: number;
}
