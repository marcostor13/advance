import { IsBoolean, IsIn, IsNumber, Min } from 'class-validator';

export class CreateSimulationDto {
  @IsIn(['factoring', 'leasing', 'capital_estructurado'])
  instrument: string;

  @IsIn(['PEN', 'USD'])
  currency: string;

  @IsNumber()
  @Min(1000)
  amount: number;

  @IsIn([3, 6, 12, 18, 24, 36])
  termMonths: number;

  @IsBoolean()
  compound: boolean;
}
