import { Type } from 'class-transformer';
<<<<<<< HEAD
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ProfileVisibility } from 'src/shared-module/entities/user.entity';
import { UserPlan } from 'src/shared-module/entities/user.entity';

class AgeRangeDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;
}

class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

class PreferencesDto {
  @IsArray()
  @IsString({ each: true })
  interestedIn: string[];

  @ValidateNested()
  @Type(() => AgeRangeDto)
  ageRange: AgeRangeDto;

  @IsNumber()
  distance: number;
}
=======
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22

export class UpdateProfileDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
}

<<<<<<< HEAD
export class UpdateProfileVisibilityDto {
  @IsNotEmpty()
  profilevisibility: ProfileVisibility;
}

export class UpdatePlan {
  @IsNotEmpty()
  userplan: UserPlan;
}
=======
class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

class PreferencesDto {
  @IsArray()
  @IsString({ each: true })
  interestedIn: string[];

  @ValidateNested()
  @Type(() => AgeRangeDto)
  ageRange: AgeRangeDto;

  @IsNumber()
  distance: number;
}

class AgeRangeDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;

}
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
