import { BaseEntity } from 'src/shared-module/entities/base.entity';
import { User } from 'src/shared-module/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'connectedUser' })
export class ConnectedUser extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  socketId: string;

  @ManyToOne(() => User, (user) => user.connectedUsers)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}
