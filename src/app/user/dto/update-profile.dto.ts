import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ProfileVisibility } from 'src/shared-module/entities/user.entity';
import { UserPlan } from 'src/shared-module/entities/user.entity';

class AgeRangeDto {
  @ApiProperty()
  @IsNumber()
  min: number;

  @ApiProperty()
  @IsNumber()
  max: number;
}

class LocationDto {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;
}

class PreferencesDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  interestedIn: string[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => AgeRangeDto)
  ageRange: AgeRangeDto;

  @ApiProperty()
  @IsNumber()
  distance: number;
}

export class UpdateProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  age: number;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
}

export class UpdateProfileVisibilityDto {
  @ApiProperty()
  @IsNotEmpty()
  profilevisibility: ProfileVisibility;
}

export class UpdatePlan {
  @ApiProperty()
  @IsNotEmpty()
  userplan: UserPlan;
}
