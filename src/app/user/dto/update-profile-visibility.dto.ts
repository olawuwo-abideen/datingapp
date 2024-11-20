import {IsNotEmpty} from 'class-validator';

export class UpdateVisibilityDto {


  @IsNotEmpty()
  profilevisible: boolean;

}



