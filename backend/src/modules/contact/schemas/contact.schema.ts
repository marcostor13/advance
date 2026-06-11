import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: true, collection: 'contacts' })
export class Contact {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  company: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'pending', enum: ['pending', 'read', 'replied'] })
  status: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
