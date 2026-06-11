import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuoteDocument = Quote & Document;

@Schema({ timestamps: true })
export class Quote {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) user: Types.ObjectId;
  @Prop({ required: true, enum: ['PEN', 'USD'] }) currency: string;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) termDays: number;
  @Prop({ default: 0.9 }) advancePct: number;
  @Prop({ required: true }) monthlyRate: number;
  @Prop({ required: true }) advanceAmount: number;
  @Prop({ required: true }) discount: number;
  @Prop({ required: true }) commission: number;
  @Prop({ required: true }) netDisbursement: number;
  @Prop({ required: true }) retention: number;
  @Prop({
    enum: ['nueva', 'contactado', 'en_proceso', 'cerrada', 'descartada'],
    default: 'nueva',
  })
  status: string;
  @Prop() notes?: string;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
