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
<<<<<<< HEAD
import { Report } from './report.entity';
=======
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ProfileVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

<<<<<<< HEAD
export enum UserPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  GOLD = 'gold',
}

=======
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstname', length: 30, nullable: true })
  firstname?: string;

  @Column({ name: 'lastname', length: 30, nullable: true })
  lastname?: string;

<<<<<<< HEAD
  @Column({ name: 'age', nullable: true })
  age?: number;

  @Column({unique: true, length: 50, nullable: false})
=======
  @Column({ name: 'lastname', length: 30, nullable: true })
  age?: number;

  @Column({ unique: true, length: 50 })
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
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

<<<<<<< HEAD
  @Column({
    type: 'enum',
    enum: UserPlan,
    default: UserPlan.FREE,
    nullable: false,
    name: 'userplan'
  })
  plan: UserPlan;

=======
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
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

<<<<<<< HEAD
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'varchar', name: 'reset_token', nullable: true })
  @Exclude()
  resetToken: string | null;

  @OneToMany(() => Report, (report) => report.user)
  reports?: Report[];
   
=======
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER, })
  role: UserRole;

  @Column({ type: 'varchar', name: 'reset_token', nullable: true })
  resetToken: string | null;

>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
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

<<<<<<< HEAD
  toJSON?(): Record<string, any> {
    return instanceToPlain(this);
  }
=======
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22

}
