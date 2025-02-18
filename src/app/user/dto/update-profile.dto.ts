import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Gender, ProfileVisibility } from '../../../shared-module/entities/user.entity';
import { UserPlan } from '../../../shared-module/entities/user.entity';


class AgeRangeDto {
  @ApiProperty({
    description: 'The minimum age in the range.',
    example: 18,
  })
  @IsNumber()
  min: number;

  @ApiProperty({
    description: 'The maximum age in the range.',
    example: 30,
  })
  @IsNumber()
  max: number;
}

class LocationDto {
  @ApiProperty({
    description: 'The latitude of the user location.',
    example: 37.7749,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'The longitude of the user location.',
    example: -122.4194,
  })
  @IsNumber()
  longitude: number;
}

class PreferencesDto {
  @ApiProperty({
    description: 'List of genders the user is interested in.',
    example: ['Male', 'Female'],
  })
  @IsArray()
  @IsString({ each: true })
  interestedIn: string[];

  @ApiProperty({
    description: 'Preferred age range for matches.',
    type: AgeRangeDto,
  })
  @ValidateNested()
  @Type(() => AgeRangeDto)
  ageRange: AgeRangeDto;

  @ApiProperty({
    description: 'Maximum distance (in miles or km) for matches.',
    example: 50,
  })
  @IsNumber()
  distance: number;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Age of the user.',
    example: 25,
  })
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '+1234567890',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'The user gender. Allowed values: Female and Male',
    enum: Gender,
    example: 'Male',
  })
 @IsNotEmpty()
 gender: Gender;

  @ApiProperty({
    description: 'Location details of the user.',
    type: LocationDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({
    description: 'User preferences for matching.',
    type: PreferencesDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
}


export class UpdateProfileVisibilityDto {
   @ApiProperty({
     description: 'The user profile visibility. Allowed values: Private,  Public',
     enum: ProfileVisibility,
     example: 'Private',
   })
  @IsNotEmpty()
  profilevisibility: ProfileVisibility;
}

export class UpdatePlan {
   @ApiProperty({
     description: 'The status of the user. Allowed values: Free, Premium, Gold',
     enum: UserPlan,
     example: 'Gold',
   })
  @IsNotEmpty()
  userplan: UserPlan;
}
