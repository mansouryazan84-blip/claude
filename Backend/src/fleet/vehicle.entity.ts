import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plate_no', unique: true, length: 30 })
  plateNo: string;

  @Column({ length: 100 })
  type: string;

  @Column({ length: 100 })
  brand: string;

  @Column({ length: 100 })
  model: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacity: number;

  @Column({ length: 30, default: 'كجم' })
  unit: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId: string;

  @Column({ name: 'driver_name', length: 150, nullable: true })
  driverName: string;

  @Column({ type: 'enum', enum: ['available','in_use','maintenance','out_of_service'], default: 'available' })
  status: VehicleStatus;

  @Column({ name: 'last_maintenance_date', type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ name: 'next_maintenance_date', type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ nullable: true })
  mileage: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
