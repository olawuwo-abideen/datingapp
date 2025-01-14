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

export enum BlockAction {
BLOCK = 'block',
UNBLOCK = 'unblock',
}

@Entity('reports')
export class Report {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ type: 'uuid', length: 36, name: 'user_id', nullable: false })
userId: string;

@Column({ name: 'blocked_user_id', nullable: true })
blockedUserId: string

@ManyToOne(() => User, (user) => user.reports)
@JoinColumn({ name: 'user_id' })
user: User;

@Column({ name: 'report_id', type: 'uuid', nullable: true, length: 36 })
reportId: string;

@ManyToOne(() => User)
@JoinColumn({ name: 'report_id' })
reportedUser: User;

@Column({nullable: true})
reason: string;

@Column({nullable: true})
details: string;

@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
deletedAt: Date;
}
