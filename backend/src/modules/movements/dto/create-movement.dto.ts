import { IsDateString, IsIn, IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMovementDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  product: string;

  @IsIn(['SUSCRIPCIÓN', 'RENDIMIENTO', 'VENCIMIENTO'])
  type: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
