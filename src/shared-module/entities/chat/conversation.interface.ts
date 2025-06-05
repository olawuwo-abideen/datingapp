import { User } from '../user.entity';

export interface Conversation {
  id: string;
  users: User[];
  lastUpdated?: Date;
}
