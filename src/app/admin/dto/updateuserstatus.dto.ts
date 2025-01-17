import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/shared-module/entities/user.entity';


export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'The status of the user. Allowed values: ACTIVE,  SUSPENDED',
    enum: UserStatus,
    example: 'ACTIVE',
  })
  @IsEnum(UserStatus, { message: 'Invalid user status provided' })
  userstatus: UserStatus;
}
