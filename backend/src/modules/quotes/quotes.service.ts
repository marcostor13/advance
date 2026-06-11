import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, QuoteDocument } from './schemas/quote.schema';
import { CreateQuoteDto } from './dto/create-quote.dto';

const MONTHLY_RATES: Record<number, number> = {
  30: 0.014,
  45: 0.0145,
  60: 0.015,
  90: 0.016,
  120: 0.017,
};

@Injectable()
export class QuotesService {
  constructor(
    @InjectModel(Quote.name) private readonly quoteModel: Model<QuoteDocument>,
  ) {}

  async create(userId: string, dto: CreateQuoteDto): Promise<QuoteDocument> {
    const { currency, amount, termDays } = dto;
    const advancePct = 0.9;
    const monthlyRate = MONTHLY_RATES[termDays];
    const advanceAmount = amount * advancePct;
    const discount = advanceAmount * monthlyRate * (termDays / 30);
    const minCommission = currency === 'PEN' ? 150 : 50;
    const commission = Math.max(amount * 0.003, minCommission);
    const netDisbursement = advanceAmount - discount - commission;
    const retention = amount - advanceAmount;

    return this.quoteModel.create({
      user: userId,
      currency,
      amount,
      termDays,
      advancePct,
      monthlyRate,
      advanceAmount,
      discount,
      commission,
      netDisbursement,
      retention,
    });
  }

  async findByUser(userId: string): Promise<QuoteDocument[]> {
    return this.quoteModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}
