import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
ManyToOne,
JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Plan } from './plan.entity';
import { Payment } from './payment.entity';
import { Expose, Exclude, instanceToPlain } from 'class-transformer';

export enum SubscriptionStatusEnum {
ACTIVE = 'active',
INACTIVE = 'inactive',
}

@Entity('subscriptions')
export class Subscription {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ name: 'user_id', type: 'uuid' })
@Exclude()
userId: string;

@Column({ name: 'payment_id', type: 'uuid', nullable: true } )
@Exclude()
paymentId: string;

@ManyToOne(() => Payment, (payment) => payment.subscriptions, { nullable: true })
@JoinColumn({ name: 'payment_id' })
payment?: Payment;

@Column({ name: 'plan_id', type: 'uuid' })
@Exclude()
planId: string;

@Column({ name: 'expires_at' })
expiresAt: Date;

@Column({
type: 'enum',
enum: SubscriptionStatusEnum,
default: SubscriptionStatusEnum.ACTIVE,
})
status: SubscriptionStatusEnum.ACTIVE | SubscriptionStatusEnum.INACTIVE;

@Column({ type: 'json', nullable: true })
meta: Record<string, any>;

@CreateDateColumn({
name: 'created_at',
})
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
updatedAt: Date;

@Expose()
get isExpired(): boolean {
return this.expiresAt < new Date();
}

@ManyToOne(() => User, (user) => user.subscriptions)
@JoinColumn({ name: 'user_id' })
user: User;

@ManyToOne(() => Plan, (plan) => plan.subscriptions)
@JoinColumn({ name: 'plan_id' })
plan: Plan;


toJSON?(): Record<string, any> {
return instanceToPlain(this);
}

}
