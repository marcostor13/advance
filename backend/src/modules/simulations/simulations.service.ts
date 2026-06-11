import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Simulation, SimulationDocument } from './schemas/simulation.schema';
import { CreateSimulationDto } from './dto/create-simulation.dto';

const ANNUAL_RATES: Record<string, number> = {
  factoring: 0.12,
  leasing: 0.10,
  capital_estructurado: 0.14,
};

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
    const annualRate = ANNUAL_RATES[instrument];
    const monthlyRate = annualRate / 12;

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
