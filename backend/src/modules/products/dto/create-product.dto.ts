import { IsIn, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsIn(['fondo', 'bono'])
  type: string;

  @IsNumber()
  @Min(0)
  annualRate: number;

  @IsNumber()
  @Min(1)
  termMonths: number;

  @IsOptional()
  @IsString()
  description?: string;
}
