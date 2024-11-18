import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;


  @IsNotEmpty()
  age: number;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  profilevisible: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
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

class AgeRangeDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;

}
