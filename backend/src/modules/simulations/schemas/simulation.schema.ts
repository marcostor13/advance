import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SimulationDocument = Simulation & Document;

interface ScheduleEntry {
  month: number;
  interest: number;
  balance: number;
}

@Schema({ timestamps: true })
export class Simulation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) user: Types.ObjectId;
  @Prop({ required: true, enum: ['factoring', 'leasing', 'capital_estructurado'] }) instrument: string;
  @Prop({ required: true, enum: ['PEN', 'USD'] }) currency: string;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) termMonths: number;
  @Prop({ required: true }) annualRate: number;
  @Prop({ required: true }) compound: boolean;
  @Prop({ required: true }) interestEarned: number;
  @Prop({ required: true }) finalAmount: number;
  @Prop({ type: [{ month: Number, interest: Number, balance: Number }], default: [] })
  schedule: ScheduleEntry[];
  @Prop({ default: 'nueva' }) status: string;
  @Prop() notes?: string;
}

export const SimulationSchema = SchemaFactory.createForClass(Simulation);
