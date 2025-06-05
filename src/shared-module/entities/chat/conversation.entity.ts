import { User } from '../user.entity';
import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => MessageEntity, (messageEntity) => messageEntity.conversation)
  messages: MessageEntity[];

  @UpdateDateColumn()
  lastUpdated: Date;
}
