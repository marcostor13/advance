import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComplaintDocument = HydratedDocument<Complaint>;

export const DOCUMENT_TYPES = ['DNI', 'CE', 'PASAPORTE', 'RUC'] as const;
export const ITEM_TYPES = ['producto', 'servicio'] as const;
export const CLAIM_TYPES = ['reclamo', 'queja'] as const;
export const COMPLAINT_STATUSES = ['pendiente', 'en_proceso', 'atendido'] as const;

// Hoja del Libro de Reclamaciones virtual (D.S. 011-2011-PCM y modificatorias)
@Schema({ timestamps: true, collection: 'complaints' })
export class Complaint {
  @Prop({ required: true, unique: true, index: true })
  code: string;

  // ── Identificación del consumidor ──
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, enum: DOCUMENT_TYPES })
  documentType: string;

  @Prop({ required: true, trim: true })
  documentNumber: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  district: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ required: true, trim: true })
  department: string;

  @Prop({ default: false })
  isMinor: boolean;

  @Prop({ trim: true })
  guardianName?: string;

  // ── Identificación del bien contratado ──
  @Prop({ required: true, enum: ITEM_TYPES })
  itemType: string;

  @Prop({ required: true, trim: true })
  itemDescription: string;

  @Prop({ min: 0 })
  claimedAmount?: number;

  @Prop({ enum: ['PEN', 'USD'], default: 'PEN' })
  currency: string;

  // ── Detalle de la reclamación ──
  @Prop({ required: true, enum: CLAIM_TYPES })
  claimType: string;

  @Prop({ required: true })
  detail: string;

  @Prop({ required: true })
  request: string;

  // ── Seguimiento interno ──
  @Prop({ enum: COMPLAINT_STATUSES, default: 'pendiente' })
  status: string;

  @Prop()
  response?: string;

  @Prop()
  respondedAt?: Date;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
