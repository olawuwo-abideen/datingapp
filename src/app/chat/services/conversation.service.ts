import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';
import { User } from '../../../shared-module/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ActiveConversationEntity } from '../../../shared-module/entities/chat/active-conversation.entity';
import { ActiveConversation } from '../../../shared-module/entities/chat/active-conversation.interface';
import { ConversationEntity } from '../../../shared-module/entities/chat/conversation.entity';
import { MessageEntity } from '../../../shared-module/entities/chat/message.entity';
import { Message } from '../../../shared-module/entities/chat/message.interface';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(ActiveConversationEntity)
    private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  getConversation(
    creatorId: string,
    friendId: string,
  ): Observable<ConversationEntity | null> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('user.id = :creatorId', { creatorId })
        .orWhere('user.id = :friendId', { friendId })
        .groupBy('conversation.id')
        .having('COUNT(*) > 1')
        .getOne(),
    );
  }

  createConversation(creator: User, friend: User): Observable<ConversationEntity> {
    return this.getConversation(creator.id, friend.id).pipe(
      switchMap((conversation: ConversationEntity | null) => {
        if (!conversation) {
          const newConversation = this.conversationRepository.create({
            users: [creator, friend],
            messages: [],
          });
          return from(this.conversationRepository.save(newConversation));
        }
        return of(conversation);
      }),
    );
  }

  getConversationsForUser(userId: string): Observable<ConversationEntity[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('user.id = :userId', { userId })
        .orderBy('conversation.lastUpdated', 'DESC')
        .getMany(),
    );
  }

  getUsersInConversation(conversationId: string): Observable<ConversationEntity[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoinAndSelect('conversation.users', 'user')
        .where('conversation.id = :conversationId', { conversationId })
        .getMany(),
    );
  }

  getConversationsWithUsers(userId: string): Observable<ConversationEntity[]> {
    return this.getConversationsForUser(userId).pipe(
      take(1),
      switchMap((conversations: ConversationEntity[]) => conversations),
      mergeMap((conversation: ConversationEntity) => {
        return this.getUsersInConversation(conversation.id);
      }),
    );
  }

joinConversation(
  friendId: string,
  userId: string,
  socketId: string,
): Observable<ActiveConversationEntity> {
  return this.getConversation(userId, friendId).pipe(
    switchMap((conversation) => {
      if (!conversation || !conversation.id) {
        throw new Error(`No conversation found for userId ${userId} and friendId ${friendId}`);
      }

      const conversationId = conversation.id;

      return from(
        this.activeConversationRepository.findOne({
          where: { userId },
        }),
      ).pipe(
        switchMap((activeConversation) => {
          const payload = {
            socketId,
            userId,
            conversationId,
          };

          if (activeConversation) {
            return from(
              this.activeConversationRepository.delete({ userId }),
            ).pipe(
              switchMap(() =>
                from(this.activeConversationRepository.save(payload)),
              ),
            );
          }

          return from(this.activeConversationRepository.save(payload));
        }),
      );
    }),
  );
}


  leaveConversation(socketId: string): Observable<DeleteResult> {
    return from(this.activeConversationRepository.delete({ socketId }));
  }

  getActiveUsers(conversationId: string): Observable<ActiveConversationEntity[]> {
    return from(
      this.activeConversationRepository.find({
        where: { conversationId },
      }),
    );
  }

  createMessage(message: Message): Observable<Message> {
    return from(this.messageRepository.save(message));
  }

  getMessages(conversationId: string): Observable<MessageEntity[]> {
    return from(
      this.messageRepository
        .createQueryBuilder('message')
        .innerJoinAndSelect('message.user', 'user')
        .where('message.conversation.id =:conversationId', { conversationId })
        .orderBy('message.createdAt', 'ASC')
        .getMany(),
    );
  }

  removeActiveConversations() {
    return from(
      this.activeConversationRepository.createQueryBuilder().delete().execute(),
    );
  }

  removeMessages() {
    return from(this.messageRepository.createQueryBuilder().delete().execute());
  }

  removeConversations() {
    return from(
      this.conversationRepository.createQueryBuilder().delete().execute(),
    );
  }
}
