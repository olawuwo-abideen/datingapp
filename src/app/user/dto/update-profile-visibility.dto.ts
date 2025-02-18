import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty} from 'class-validator';
import { ProfileVisibility } from '../../../shared-module/entities/user.entity';

export class UpdateVisibilityDto {


  @ApiProperty()
  @IsNotEmpty()
  profilevisibility: ProfileVisibility;

}



