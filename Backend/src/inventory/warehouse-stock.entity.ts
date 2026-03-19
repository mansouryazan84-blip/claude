import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Item } from '../items/item.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Entity('warehouse_stock')
export class WarehouseStock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  quantity: number;

  @Column({ name: 'location_code', length: 50, nullable: true })
  locationCode: string;

  @UpdateDateColumn({ name: 'last_updated' })
  lastUpdated: Date;
}
