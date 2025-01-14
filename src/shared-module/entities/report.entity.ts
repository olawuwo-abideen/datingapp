import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    DeleteDateColumn,
    ManyToOne,
    Index,
    OneToOne,
  } from 'typeorm';
  import { User } from './user.entity';

 
  @Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', length: 36, name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'report_id', type: 'uuid', nullable: false, length: 36 })
  reportId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'report_id' })
  reportedUser: User;

  @Column()
  reason: string;

  @Column()
  details: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
