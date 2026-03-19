import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('item_categories')
export class ItemCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name_ar', length: 100 })
  nameAr: string;

  @Column({ name: 'name_en', length: 100, nullable: true })
  nameEn: string;

  @Column({ length: 20, nullable: true })
  color: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => ItemCategory, c => c.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: ItemCategory;

  @OneToMany(() => ItemCategory, c => c.parent)
  children: ItemCategory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
