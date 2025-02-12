import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from '../dtos/message/create-message.dto';
import { FilterMessageDto } from '../dtos/message/filter-message.dto';
import { MessageDto } from '../dtos/message/message.dto';
import { UpdateMessageDto } from '../dtos/message/update-message.dto';
import { DeleteMessageDto } from '../dtos/message/delete-message.dto';
import { WsException } from '@nestjs/websockets';
import { TResultAndCount } from '../types/result-and-count.type';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<TResultAndCount<MessageDto>> {
    try {
      const newMessage = this.messageRepository.create({
        ...createMessageDto,
        createdBy: userId,
        updatedBy: userId,
      });

      await this.messageRepository.save(newMessage);
      this.logger.log(`Message created successfully by User ID: ${userId}`);
      return await this.findByRoomId({ roomId: createMessageDto.roomId });
    } catch (error) {
      this.logger.error(
        `Failed to create message by User ID: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      throw new WsException(
        'An error occurred while creating the message. Please try again.',
      );
    }
  }

  async findByRoomId(
    filterMessageDto: FilterMessageDto,
  ): Promise<TResultAndCount<MessageDto>> {
    const { first = 0, rows = 20, filter = '', roomId } = filterMessageDto;

    try {
      const [result, total] = await this.messageRepository.findAndCount({
        where: { text: ILike(`%${filter}%`), roomId },
        relations: ['creator'],
        order: { createdAt: 'DESC' },
        take: rows,
        skip: first,
      });

      const sanitizedMessages = result.map((message) => {
        const { creator } = message;
        const { password, ...sanitizedCreator } = creator;
        return { ...message, creator: sanitizedCreator };
      });

      return { result: sanitizedMessages, total };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve messages for room ID ${roomId}: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw new WsException(
          error.message || 'The requested resource was not found.',
        );
      }

      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException(
        'An error occurred while fetching messages. Please try again later.',
      );
    }
  }

  async update(
    userId: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const { messageId, text } = updateMessageDto;

    try {
      const existingMessage = await this.messageRepository.findOne({
        where: { id: messageId },
      });

      if (!existingMessage) {
        throw new NotFoundException(
          `Message with ID "${messageId}" not found.`,
        );
      }

      if (existingMessage.createdBy !== userId) {
        throw new WsException(
          'Access Denied: You can only update your own messages.',
        );
      }

      await this.messageRepository.update(
        { id: messageId },
        { text, createdAt: new Date() },
      );

      this.logger.log(
        `Message ID ${messageId} updated successfully by User ID: ${userId}`,
      );

      return await this.messageRepository.findOne({
        where: {
          id: messageId,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to update message ID ${messageId} by User ID: ${userId}. Error: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw new WsException(
          error.message || 'The requested resource was not found.',
        );
      }

      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException(
        'An error occurred while updating the message. Please try again.',
      );
    }
  }

  async delete(
    userId: string,
    deleteMessageDto: DeleteMessageDto,
  ): Promise<void> {
    const { roomId, messageIds } = deleteMessageDto;

    try {
      for (const messageId of messageIds) {
        const message = await this.messageRepository.findOne({
          where: { id: messageId, roomId },
        });

        if (!message) {
          this.logger.warn(
            `Message with ID "${messageId}" not found in room ID "${roomId}".`,
          );
          continue;
        }

        if (message.createdBy !== userId) {
          throw new WsException(
            `Access Denied: You can only delete your own messages.`,
          );
        }

        await this.messageRepository.delete({ id: messageId });
        this.logger.log(
          `Message ID ${messageId} deleted successfully by User ID: ${userId}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed operation: ${error.message}`, error.stack);

      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }
}
