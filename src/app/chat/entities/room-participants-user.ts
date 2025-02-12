import { BaseEntity } from 'src/shared-module/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'roomParticipantsUser' })
export class RoomParticipantsUser extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  roomId: string;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;
}
