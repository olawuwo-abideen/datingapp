import { User } from '../user.entity';
import { Conversation } from './conversation.interface';

export interface Message {
  id: string;
  message: string;
  user: User;
  conversation: Conversation;
  createdAt?: Date;
}
