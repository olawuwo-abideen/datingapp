import {
  OnModuleInit,
  UseGuards,
  Injectable,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { of, Subscription, take } from 'rxjs';

import { User } from 'src/shared-module/entities/user.entity';
import { AuthService } from '../../auth/services/auth.service';
import { ConversationService } from '../services/conversation.service';
import { MatchService } from '../../match/services/match.service';
import { Message } from '../../../shared-module/entities/chat/message.interface';
import { ActiveConversation } from '../../../shared-module/entities/chat/active-conversation.interface';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100'] } })
@Injectable()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private authService: AuthService,
    private conversationService: ConversationService,
    private matchService: MatchService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.conversationService.removeActiveConversations().pipe(take(1)).subscribe();
    this.conversationService.removeMessages().pipe(take(1)).subscribe();
    this.conversationService.removeConversations().pipe(take(1)).subscribe();
  }

  async handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers.authorization;

    if (!jwt) {
      this.handleDisconnect(socket);
      return;
    }

    try {
      const user = await this.authService.getJwtUser(jwt);

      if (!user || !user.id) {
        this.handleDisconnect(socket);
        return;
      }

      socket.data.user = user;
      this.getConversations(socket, user.id);
    } catch (error) {
      this.handleDisconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    this.conversationService.leaveConversation(socket.id).pipe(take(1)).subscribe();
  }

  getConversations(socket: Socket, userId: string): Subscription {
    return this.conversationService
      .getConversationsWithUsers(userId)
      .subscribe((conversations) => {
        this.server.to(socket.id).emit('conversations', conversations);
      });
  }

  @SubscribeMessage('createConversation')
  async createConversation(socket: Socket, friend: User) {
    const user: User = socket.data.user;
    const userId = user.id;
    const friendId = friend.id;

    if (!userId || !friendId) {
      this.server.to(socket.id).emit('error', 'Invalid user IDs');
      return;
    }

    const isMatch = await this.matchService.isMutualMatch(userId, friendId).toPromise();

    if (!isMatch) {
      this.server.to(socket.id).emit('error', 'You are not matched with this user');
      return;
    }

    this.conversationService
      .createConversation(user, friend)
      .pipe(take(1))
      .subscribe(() => {
        this.getConversations(socket, userId);
      });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, newMessage: Message) {
    const { user } = socket.data;
    const conversationId = newMessage.conversation?.id;

    if (!conversationId) return of(null);

    newMessage.user = user;

    this.conversationService
      .createMessage(newMessage)
      .pipe(take(1))
      .subscribe((message: Message) => {
        newMessage.id = message.id;

        this.conversationService
          .getActiveUsers(conversationId)
          .pipe(take(1))
          .subscribe((activeConversations: ActiveConversation[]) => {
            activeConversations.forEach((ac) => {
              if (ac.socketId) {
                this.server.to(ac.socketId).emit('newMessage', newMessage);
              }
            });
          });
      });
  }

  @SubscribeMessage('joinConversation')
  joinConversation(socket: Socket, friendId: string) {
    const userId = socket.data.user?.id;
    if (!userId) return;

    this.conversationService
      .joinConversation(friendId, userId, socket.id)
      .pipe(take(1))
      .subscribe((activeConversation: ActiveConversation) => {
        const convoId = activeConversation.conversationId;
        if (!convoId) return;

        this.conversationService
          .getMessages(convoId)
          .pipe(take(1))
          .subscribe((messages: Message[]) => {
            this.server.to(socket.id).emit('messages', messages);
          });
      });
  }

  @SubscribeMessage('leaveConversation')
  leaveConversation(socket: Socket) {
    this.conversationService.leaveConversation(socket.id).pipe(take(1)).subscribe();
  }
}
