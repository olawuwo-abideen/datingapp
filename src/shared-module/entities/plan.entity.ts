import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
OneToMany,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { Expose } from 'class-transformer';

export enum PlanStatusEnum {
ACTIVE = 'active',
INACTIVE = 'inactive',
}

@Entity('plans')
export class Plan {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ length: 50 })
name: string;

@Column({ type: 'text', nullable: true })
description?: string;

@Column({ type: 'simple-array', nullable: true })
features: string[];

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
amount: number;

@Column({ type: 'varchar' })
duration: string;

@Column({
type: 'enum',
enum: PlanStatusEnum,
default: PlanStatusEnum.ACTIVE,
})
status: PlanStatusEnum;


@OneToMany(() => Subscription, (subscription) => subscription.user)
subscriptions: Subscription[];

@Expose()
get isFree(): boolean {
return this.amount == 0;
}

@CreateDateColumn({
name: 'created_at',
})
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
updatedAt: Date;


}
