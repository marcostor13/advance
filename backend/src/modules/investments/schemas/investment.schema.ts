import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvestmentDocument = Investment & Document;

export type InvestmentStatus = 'active' | 'matured' | 'pending' | 'cancelled';
export type MovementType = 'deposit' | 'interest' | 'payout' | 'maturity';

interface Movement {
  date: Date;
  type: MovementType;
  amount: number;
  description: string;
}

@Schema({ timestamps: true })
export class Investment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) user: Types.ObjectId;
  @Prop({ required: true, trim: true }) product: string;
  @Prop({ required: true, enum: ['factoring', 'leasing', 'capital_estructurado'] }) instrument: string;
  @Prop({ required: true, enum: ['PEN', 'USD'] }) currency: string;
  @Prop({ required: true }) principal: number;
  @Prop({ required: true }) annualRate: number;
  @Prop({ required: true }) termMonths: number;
  @Prop({ required: true }) startDate: Date;
  @Prop({ required: true }) maturityDate: Date;
  @Prop({ required: true }) currentValue: number;
  @Prop({ default: 0 }) interestAccrued: number;
  @Prop({ enum: ['active', 'matured', 'pending', 'cancelled'], default: 'active' }) status: string;
  @Prop({
    type: [{ date: Date, type: String, amount: Number, description: String }],
    default: [],
  })
  movements: Movement[];
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
