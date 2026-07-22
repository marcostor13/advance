import { IsBoolean, IsIn, IsNumber, Min } from 'class-validator';

export class CreateSimulationDto {
  @IsIn(['bono', 'fondo'])
  instrument: string;

  @IsIn(['PEN', 'USD'])
  currency: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsIn([3, 6, 12, 18, 24, 36])
  termMonths: number;

  @IsBoolean()
  compound: boolean;
}
