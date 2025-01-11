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
  import { Exclude, instanceToPlain } from 'class-transformer';
 
  
  @Entity('reports')
  export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid', length: 36, name: 'user_id', nullable: true })
    @Exclude()
    userId?: string | null;
  
    @ManyToOne(() => User, (user) => user.reports)
    @JoinColumn({ name: 'user_id' })
    user?: User | null;
  
    @Column({ name: 'report_id', type: 'uuid', nullable: false, length: 36 })
    reportId: string;
  
    @Column()
    reason: string;
  
    @Column()
    details?: string;
  
  
    @CreateDateColumn({
      name: 'created_at',
    })
    @Exclude()
    createdAt: Date;
  
    @UpdateDateColumn({
      name: 'updated_at',
    })
    @Exclude()
    updatedAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    @Exclude()
    deletedAt: Date;

  
    toJSON?(): Record<string, any> {
      return instanceToPlain(this);
    }
  }
  