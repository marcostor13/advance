import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Simulation, SimulationDocument } from './schemas/simulation.schema';
import { CreateSimulationDto } from './dto/create-simulation.dto';

// Whole-percent annual rates (e.g. 8 means 8%). Bono: tasa fija. Fondo: tasa variable
// (referencial), oscila ±2-3 puntos porcentuales según mercado.
const ANNUAL_RATES: Record<string, Record<string, number>> = {
  bono: { USD: 8, PEN: 10 },
  fondo: { USD: 8, PEN: 10 },
};

const MIN_AMOUNTS: Record<string, Record<string, number>> = {
  bono: { USD: 30_000, PEN: 100_000 },
  fondo: { USD: 10_000, PEN: 30_000 },
};

const CURRENCY_LABELS: Record<string, string> = { USD: 'dólares', PEN: 'soles' };

interface ScheduleEntry {
  month: number;
  interest: number;
  balance: number;
}

@Injectable()
export class SimulationsService {
  constructor(
    @InjectModel(Simulation.name) private readonly simulationModel: Model<SimulationDocument>,
  ) {}

  async create(userId: string, dto: CreateSimulationDto): Promise<SimulationDocument> {
    const { instrument, currency, amount, termMonths, compound } = dto;

    const minAmount = MIN_AMOUNTS[instrument][currency];
    if (amount < minAmount) {
      throw new BadRequestException(
        `El monto mínimo para ${instrument === 'bono' ? 'Bono' : 'Fondo'} en ${CURRENCY_LABELS[currency]} es ${minAmount.toLocaleString('es-PE')}.`,
      );
    }

    const annualRate = ANNUAL_RATES[instrument][currency];
    const monthlyRate = annualRate / 100 / 12;

    const schedule: ScheduleEntry[] = [];

    for (let month = 1; month <= termMonths; month++) {
      let balance: number;
      let interest: number;

      if (compound) {
        balance = amount * Math.pow(1 + monthlyRate, month);
        const prevBalance = month === 1 ? amount : amount * Math.pow(1 + monthlyRate, month - 1);
        interest = balance - prevBalance;
      } else {
        interest = amount * monthlyRate;
        balance = amount + month * interest;
      }

      schedule.push({ month, interest, balance });
    }

    const finalAmount = schedule[schedule.length - 1].balance;
    const interestEarned = finalAmount - amount;

    return this.simulationModel.create({
      user: userId,
      instrument,
      currency,
      amount,
      termMonths,
      annualRate,
      compound,
      interestEarned,
      finalAmount,
      schedule,
    });
  }

  async findByUser(userId: string): Promise<SimulationDocument[]> {
    return this.simulationModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}
