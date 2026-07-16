import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

export type ReportType = 'monthly' | 'quarterly' | 'annual' | 'statement';

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) user: Types.ObjectId;
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ required: true, enum: ['monthly', 'quarterly', 'annual', 'statement'] }) type: string;
  @Prop({ required: true, trim: true }) period: string;
  @Prop({ trim: true }) summary?: string;
  @Prop({ required: true }) fileUrl: string;
  @Prop({ default: 0 }) sizeKb: number;
  @Prop({ required: true }) publishedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
