import { Exclude, instanceToPlain } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
  OneToOne,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ProfileVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstname', length: 30, nullable: true })
  firstname?: string;

  @Column({ name: 'lastname', length: 30, nullable: true })
  lastname?: string;

  @Column({ name: 'lastname', length: 30, nullable: true })
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
    name: 'profilevisibility'
  })
  profilevisibility: ProfileVisibility;

  @Column({  nullable: true, name: 'location', type: 'json' })
  location: {
    latitude: number;
    longitude: number;
  };

  @Column({  nullable: true, name: 'preference', type: 'json' })
  preferences: {
    interestedIn: string[];
    ageRange: { min: number; max: number };
    distance: number;
  };


  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'varchar', name: 'reset_token', nullable: true })
  resetToken: string | null;

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


}
