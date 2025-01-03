import { User } from '../../../shared-module/entities/user.entity';

export class UserCreatedEvent {
  constructor(public user: User) {}
}
