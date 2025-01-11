import { IsNotEmpty, IsString } from 'class-validator';

export class ReportDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  details: string;
}
