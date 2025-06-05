import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { ConversationEntity } from '../../shared-module/entities/chat/conversation.entity';
import { MessageEntity } from '../../shared-module/entities/chat/message.entity';
import { ActiveConversationEntity } from '../../shared-module/entities/chat/active-conversation.entity';
import { User } from '../../shared-module/entities/user.entity'; // Adjust path as needed
import { ConversationService } from './services/conversation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      ActiveConversationEntity,
      User,
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ConversationService],
  exports: [ConversationService], // if needed elsewhere
})
export class ChatModule {}
