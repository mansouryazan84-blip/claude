import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contact } from '../contacts/contact.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

export type OrderStatus = 'draft' | 'pending' | 'approved' | 'partial' | 'completed' | 'cancelled';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'order_no', unique: true, length: 50 }) orderNo: string;
  @Column({ name: 'supplier_id' }) supplierId: string;
  @ManyToOne(() => Contact) @JoinColumn({ name: 'supplier_id' }) supplier: Contact;
  @Column({ name: 'warehouse_id' }) warehouseId: string;
  @ManyToOne(() => Warehouse) @JoinColumn({ name: 'warehouse_id' }) warehouse: Warehouse;
  @Column({ type: 'enum', enum: ['draft','pending','approved','partial','completed','cancelled'], default: 'draft' }) status: OrderStatus;
  @Column({ name: 'order_date', type: 'date' }) orderDate: Date;
  @Column({ name: 'expected_date', type: 'date', nullable: true }) expectedDate: Date;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) subtotal: number;
  @Column({ name: 'tax_total', type: 'decimal', precision: 15, scale: 2, default: 0 }) taxTotal: number;
  @Column({ name: 'discount_total', type: 'decimal', precision: 15, scale: 2, default: 0 }) discountTotal: number;
  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 2, default: 0 }) grandTotal: number;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ name: 'created_by_id' }) createdById: string;
  @Column({ name: 'created_by_name', length: 150 }) createdByName: string;
  @OneToMany(() => PurchaseOrderLine, l => l.order, { cascade: true }) lines: PurchaseOrderLine[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}

@Entity('purchase_order_lines')
export class PurchaseOrderLine {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'order_id' }) orderId: string;
  @ManyToOne(() => PurchaseOrder, o => o.lines, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'order_id' }) order: PurchaseOrder;
  @Column({ name: 'item_id' }) itemId: string;
  @Column({ name: 'item_name', length: 200 }) itemName: string;
  @Column({ name: 'item_sku', length: 50 }) itemSku: string;
  @Column({ name: 'ordered_qty', type: 'decimal', precision: 12, scale: 3 }) orderedQty: number;
  @Column({ name: 'received_qty', type: 'decimal', precision: 12, scale: 3, default: 0 }) receivedQty: number;
  @Column({ length: 20 }) unit: string;
  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 }) unitPrice: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) discount: number;
  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 }) taxRate: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) total: number;
}
