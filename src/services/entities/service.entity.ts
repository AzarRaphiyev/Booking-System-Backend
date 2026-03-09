import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Məs: "Saç kəsimi", "Müayinə"

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int', default: 30 })
  durationInMinutes: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number; // Xidmətin qiyməti

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
