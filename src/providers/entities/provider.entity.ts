import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Service } from '../../services/entities/service.entity';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  // İş saatları JSON şəklində saxlaya bilərik (start və end time)
  // Məs: [{"day": "Monday", "start": "09:00", "end": "18:00"}, ...]
  @Column('jsonb', { nullable: true })
  workHours: { day: string; start: string; end: string }[];

  // Hər provider bir neçə xidmət təklif edə bilər
  @ManyToMany(() => Service)
  @JoinTable()
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
