import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

export type NewsCategory = 'mercado' | 'empresa' | 'producto' | 'educacion';

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ required: true, trim: true }) excerpt: string;
  @Prop({ required: true }) body: string;
  @Prop({ required: true, enum: ['mercado', 'empresa', 'producto', 'educacion'] }) category: string;
  @Prop({ required: true }) image: string;
  @Prop({ trim: true }) author?: string;
  @Prop({ default: false }) featured: boolean;
  @Prop({ required: true }) publishedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
