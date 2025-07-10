import { ApiProperty } from '@nestjs/swagger';
import {
IsString,
IsNotEmpty,
IsDecimal,
IsInt,
ArrayMinSize,
IsOptional,
IsUUID,
} from 'class-validator';

export class CreatePlanDto {
@ApiProperty({
required: false,
description: 'The plan name',
example: 'Free plan (Ad-Supported)',
})
@IsString()
@IsNotEmpty()
name: string;

@ApiProperty({
required: false,
description: 'The plan description',
example: 'Ideal for casual listeners who don`t mind ads',
})
@IsString()
@IsOptional()
description: string;

@ApiProperty({
  required: false,
  description: 'The plan features',
  example: ['Ads between songs', 'No offline downloads', 'Lower audio quality'],
})
@IsString({ each: true })
@ArrayMinSize(1)
features: string[];


@ApiProperty({
required: false,
description: 'The plan amount',
example: '10.98',
})
@IsDecimal()
@IsNotEmpty()
amount: number;

@ApiProperty({
required: false,
description: 'The plan duration in month',
example: '1',
})
@IsInt()
@IsNotEmpty()
duration: number;
}





export class RenewSubscriptionDto {
@ApiProperty({
required: true,
description: 'The plan id',
example: '04e0197c-d833-4bf0-8a60-cd436cb7ec76',
})
@IsUUID()
@IsNotEmpty()
planId: string;

@ApiProperty({
description: 'The plan reference',
example: '04e0197c-d833-4bf0-8a60-cd436cb7ec76',
})
@IsString()
@IsOptional()
reference: string;

}
