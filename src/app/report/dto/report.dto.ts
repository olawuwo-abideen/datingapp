import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReportDto {

  @ApiProperty({
    required: true,
    description: 'Spam message',
    example: 'Spam message',
    })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({
    required: true,
    description: 'The user keeps sending spam message',
    example: 'The user keeps sending spam message',
    })
  @IsNotEmpty()
  @IsString()
  details: string;
}
