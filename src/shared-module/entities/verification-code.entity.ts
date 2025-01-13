import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum VerificationAction {
    USER_VERIFICATION = 'user-verification',
  }
  
  @Entity('verification_codes')
  export class VerificationCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    code: string;
  
    @Column({ nullable: true, name: 'user_id', type: 'uuid', length: 36 })
    userId?: number;
  
    @Column({ nullable: true, name: 'guest_id' })
    guestId?: string;
  
    @Column({ type: 'enum', enum: VerificationAction, name: 'action' })
    action: VerificationAction;
  
    @Column()
    verified: boolean;
  
    @Column({ nullable: true, name: 'expires_at' })
    expiresAt?: Date;
  
    @Column({ nullable: true, name: 'verified_at' })
    verifiedAt?: Date;
  
    @Column({ type: 'json', nullable: true })
    meta?: any;
    // meta?: Record<string, any>;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt?: Date;
  }
  