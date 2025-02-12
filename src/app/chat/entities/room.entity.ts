import { BaseEntity } from 'src/shared-module/entities/base.entity';
import {
  Entity,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from 'src/shared-module/entities/user.entity';
import { Message } from './message.entity';

@Entity({ name: 'room' })
@Unique(['name'])
export class Room extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  type: string;

  @ManyToMany(() => User, (user) => user.rooms)
  @JoinTable({
    name: 'roomParticipantsUser',
    joinColumn: {
      name: 'roomId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  participants: User[];

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
