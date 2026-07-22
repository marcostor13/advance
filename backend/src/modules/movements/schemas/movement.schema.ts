import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type MovementDocument = Movement & Document;

@Schema({ timestamps: true })
export class Movement {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true }) user: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product', required: true, index: true }) product: Types.ObjectId;
  @Prop({ required: true, enum: ['SUSCRIPCIÓN', 'RENDIMIENTO', 'VENCIMIENTO'] }) type: string;
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) date: Date;
  @Prop({ trim: true }) notes?: string;
}

export const MovementSchema = SchemaFactory.createForClass(Movement);
