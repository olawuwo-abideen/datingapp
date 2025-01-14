import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/shared-module/entities/user.entity';


export class UpdateUserStatusDto {
  @IsEnum(UserStatus, { message: 'Invalid user status provided' })
  userstatus: UserStatus;
}
