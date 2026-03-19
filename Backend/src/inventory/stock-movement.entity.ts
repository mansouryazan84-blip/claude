import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Item } from '../items/item.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { User } from '../users/user.entity';

export type MovementType = 'in' | 'out' | 'transfer' | 'adjustment' | 'return';
export type MovementStatus = 'pending' | 'approved' | 'in_transit' | 'completed' | 'cancelled';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reference_no', unique: true, length: 50 })
  referenceNo: string;

  @Column({ type: 'enum', enum: ['in','out','transfer','adjustment','return'] })
  type: MovementType;

  @Column({ type: 'enum', enum: ['pending','approved','in_transit','completed','cancelled'], default: 'pending' })
  status: MovementStatus;

  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ name: 'from_warehouse_id', nullable: true })
  fromWarehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @Column({ name: 'to_warehouse_id', nullable: true })
  toWarehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @Column({ type: 'decimal', precision: 15, scale: 3 })
  quantity: number;

  @Column({ length: 20 })
  unit: string;

  @Column({ name: 'batch_no', length: 50, nullable: true })
  batchNo: string;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'requested_by_id' })
  requestedById: string;

  @Column({ name: 'requested_by_name', length: 150 })
  requestedByName: string;

  @Column({ name: 'approved_by_id', nullable: true })
  approvedById: string;

  @Column({ name: 'approved_by_name', length: 150, nullable: true })
  approvedByName: string;

  @Column({ name: 'driver_name', length: 150, nullable: true })
  driverName: string;

  @Column({ name: 'vehicle_no', length: 30, nullable: true })
  vehicleNo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
