import { IsIn, IsNumber, Max, Min } from 'class-validator';

export class CreateQuoteDto {
  @IsIn(['PEN', 'USD'])
  currency: string;

  @IsNumber()
  @Min(1000)
  @Max(10000000)
  amount: number;

  @IsIn([30, 45, 60, 90, 120])
  termDays: number;
}
