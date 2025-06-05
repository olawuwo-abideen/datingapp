import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('active_conversation')
export class ActiveConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  socketId: string;

  @Column()
  userId: string;

  @Column()
  conversationId: string;
}
