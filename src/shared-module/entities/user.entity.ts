import { Exclude, instanceToPlain } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn
} from 'typeorm';
import { Report } from './report.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ProfileVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export enum UserPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  GOLD = 'gold',
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',   
  SUSPENDED = 'suspended' 
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstname', length: 30, nullable: true })
  firstname?: string;

  @Column({ name: 'lastname', length: 30, nullable: true })
  lastname?: string;

  @Column({ name: 'age', nullable: true })
  age?: number;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ nullable: true })
  profileimage?: string;

  @Column({
    type: 'enum',
    enum: ProfileVisibility,
    default: ProfileVisibility.PRIVATE,
    nullable: false,
    name: 'profilevisibility',
  })
  profilevisibility: ProfileVisibility;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    nullable: false,
    name: 'userstatus',
  })
  userstatus: UserStatus;


  @Column({
    type: 'enum',
    enum: UserPlan,
    default: UserPlan.FREE,
    nullable: false,
    name: 'userplan',
  })
  plan: UserPlan;

  @Column({ nullable: true, name: 'location', type: 'json' })
  location: {
    latitude: number;
    longitude: number;
  };

  @Column({ nullable: true, name: 'preference', type: 'json' })
  preferences: {
    interestedIn: string[];
    ageRange: { min: number; max: number };
    distance: number;
  };

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'varchar', name: 'reset_token', nullable: true })
  @Exclude()
  resetToken: string | null;

  @OneToMany(() => Report, (report) => report.user)
  reports?: Report[];

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
