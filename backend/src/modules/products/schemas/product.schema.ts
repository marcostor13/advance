import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true, trim: true }) name: string;
  @Prop({ required: true, enum: ['fondo', 'bono'] }) type: string;
  @Prop({ required: true }) annualRate: number;
  @Prop({ required: true }) termMonths: number;
  @Prop({ trim: true }) description?: string;
  @Prop({ enum: ['activo', 'cerrado'], default: 'activo' }) status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
