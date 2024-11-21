import {IsNotEmpty} from 'class-validator';
import { ProfileVisibility } from 'src/shared-module/entities/user.entity';

export class UpdateVisibilityDto {


  @IsNotEmpty()
  profilevisibility: ProfileVisibility;

}



