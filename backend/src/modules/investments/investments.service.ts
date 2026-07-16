import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Investment, InvestmentDocument } from './schemas/investment.schema';

export interface PortfolioSummary {
  currency: string;
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnPct: number;
  activeCount: number;
  maturedCount: number;
  weightedRate: number;
  byInstrument: { instrument: string; value: number }[];
}

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectModel(Investment.name) private readonly model: Model<InvestmentDocument>,
  ) {}

  async findByUser(userId: string): Promise<InvestmentDocument[]> {
    const existing = await this.model.find({ user: userId }).sort({ startDate: -1 }).exec();
    if (existing.length > 0) return existing;
    await this.seedForUser(userId);
    return this.model.find({ user: userId }).sort({ startDate: -1 }).exec();
  }

  async summary(userId: string): Promise<PortfolioSummary> {
    const investments = await this.findByUser(userId);
    const active = investments.filter((i) => i.status === 'active');

    const totalInvested = active.reduce((s, i) => s + i.principal, 0);
    const currentValue = active.reduce((s, i) => s + i.currentValue, 0);
    const totalReturns = currentValue - totalInvested;
    const returnPct = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
    const weightedRate =
      totalInvested > 0
        ? active.reduce((s, i) => s + i.annualRate * i.principal, 0) / totalInvested
        : 0;

    const map = new Map<string, number>();
    for (const i of active) {
      map.set(i.instrument, (map.get(i.instrument) ?? 0) + i.currentValue);
    }

    return {
      currency: investments[0]?.currency ?? 'PEN',
      totalInvested,
      currentValue,
      totalReturns,
      returnPct,
      activeCount: active.length,
      maturedCount: investments.filter((i) => i.status === 'matured').length,
      weightedRate: weightedRate * 100,
      byInstrument: [...map.entries()].map(([instrument, value]) => ({ instrument, value })),
    };
  }

  // Demo seed — gives every new client a realistic portfolio to explore.
  private async seedForUser(userId: string): Promise<void> {
    const user = new Types.ObjectId(userId);
    const now = new Date();
    const month = 30 * 24 * 60 * 60 * 1000;

    const seeds = [
      {
        product: 'Pagaré Estructurado Serie A-24',
        instrument: 'capital_estructurado',
        principal: 120000,
        annualRate: 0.14,
        termMonths: 24,
        startOffset: -8,
        status: 'active',
      },
      {
        product: 'Fondo Factoring Corporativo',
        instrument: 'factoring',
        principal: 65000,
        annualRate: 0.12,
        termMonths: 12,
        startOffset: -5,
        status: 'active',
      },
      {
        product: 'Leasing Financiero Flota 2025',
        instrument: 'leasing',
        principal: 48000,
        annualRate: 0.1,
        termMonths: 18,
        startOffset: -3,
        status: 'active',
      },
      {
        product: 'Pagaré Estructurado Serie B-23',
        instrument: 'capital_estructurado',
        principal: 40000,
        annualRate: 0.135,
        termMonths: 12,
        startOffset: -15,
        status: 'matured',
      },
    ];

    const docs = seeds.map((s) => {
      const startDate = new Date(now.getTime() + s.startOffset * month);
      const maturityDate = new Date(startDate.getTime() + s.termMonths * month);
      const elapsed = Math.min(Math.max(-s.startOffset, 0), s.termMonths);
      const monthlyRate = s.annualRate / 12;
      const interestAccrued =
        s.status === 'matured'
          ? s.principal * monthlyRate * s.termMonths
          : s.principal * monthlyRate * elapsed;
      const currentValue = s.principal + interestAccrued;

      const movements = [
        {
          date: startDate,
          type: 'deposit' as const,
          amount: s.principal,
          description: 'Suscripción inicial de capital',
        },
      ];
      for (let m = 1; m <= elapsed; m++) {
        movements.push({
          date: new Date(startDate.getTime() + m * month),
          type: 'interest' as const,
          amount: s.principal * monthlyRate,
          description: `Rendimiento devengado mes ${m}`,
        });
      }
      if (s.status === 'matured') {
        movements.push({
          date: maturityDate,
          type: 'maturity' as const,
          amount: currentValue,
          description: 'Vencimiento y liquidación de capital + rendimientos',
        });
      }

      return {
        user,
        product: s.product,
        instrument: s.instrument,
        currency: 'PEN',
        principal: s.principal,
        annualRate: s.annualRate,
        termMonths: s.termMonths,
        startDate,
        maturityDate,
        currentValue,
        interestAccrued,
        status: s.status,
        movements,
      };
    });

    await this.model.insertMany(docs);
  }
}
