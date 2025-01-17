import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  // @IsOptional()
  // @IsNumberString()
  page: number = 0;

  // @IsOptional()
  // @IsNumberString()
  pageSize: number = 0;
}
