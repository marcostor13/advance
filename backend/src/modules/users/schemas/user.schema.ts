import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ trim: true }) lastName?: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email: string;
  @Prop({ trim: true }) phone?: string;
  @Prop({ trim: true }) company?: string;
  @Prop({ required: true, select: false }) password: string;
  @Prop({ enum: ['client', 'admin'], default: 'client' }) role: string;

  // Document identity — used to link portal accounts to Excel imports.
  @Prop({ enum: ['DNI', 'CE', 'RUC', 'Pasaporte'] }) documentType?: string;
  @Prop({ unique: true, sparse: true, trim: true }) documentNumber?: string;

  // Location
  @Prop({ trim: true }) address?: string;
  @Prop({ trim: true }) district?: string;
  @Prop({ trim: true }) city?: string;
  @Prop({ trim: true }) country?: string;

  // Banking
  @Prop({ trim: true }) bank?: string;
  @Prop({ trim: true }) accountNumber?: string;
  @Prop({ trim: true }) cci?: string;

  // Investor profile
  @Prop({ enum: ['conservador', 'moderado', 'agresivo'] }) riskProfile?: string;
  @Prop() birthDate?: Date;
  @Prop({ trim: true }) occupation?: string;

  // Password lifecycle
  @Prop({ default: false }) mustChangePassword: boolean;
  @Prop({ select: false }) resetPasswordToken?: string;
  @Prop({ select: false }) resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
