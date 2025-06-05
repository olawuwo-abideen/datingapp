import { User} from '../user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @ManyToOne(() => User, (userEntity) => userEntity.messages)
  user: User;

  @ManyToOne(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.messages,
  )
  conversation: ConversationEntity;

  @CreateDateColumn()
  createdAt: Date;
}
