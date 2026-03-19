import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity('unit_conversions')
export class UnitConversion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'item_id' })
  itemId: string;

  @ManyToOne(() => Item, i => i.unitConversions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column({ name: 'from_unit', length: 20 })
  fromUnit: string;

  @Column({ name: 'to_unit', length: 20 })
  toUnit: string;

  @Column({ type: 'decimal', precision: 12, scale: 6 })
  factor: number;
}
