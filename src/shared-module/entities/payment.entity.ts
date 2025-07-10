import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
DeleteDateColumn,
JoinColumn,
ManyToOne,
OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';
import { Exclude } from 'class-transformer';


@Entity('payments')
export class Payment {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ type: 'uuid', name: 'user_id',  nullable: true })
userId: string | null;

@ManyToOne(() => User, (user) => user.payments)
@JoinColumn({ name: 'user_id' })
user?: User | null;

@Column({ length: 50, unique: true })
reference: string;

@Column({ type: 'decimal', precision: 10, scale: 2 })
amount: number;


@Column({ name: 'payment_method', length: 30 })
paymentMethod: string;

@Column({ type: 'text' })
description: string;

@Column({ length: 20 })
status: string;

@OneToMany(() => Subscription, (subscription) => subscription.payment)
subscriptions?: Subscription[];

@CreateDateColumn({
name: 'created_at',
})
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
deletedAt: Date;



}
