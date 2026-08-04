import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Complaint, ComplaintDocument } from './schemas/complaint.schema';

export interface ComplaintReceipt {
  id: string;
  code: string;
  createdAt: Date;
}

const CODE_PREFIX = 'LR';
const MAX_CODE_ATTEMPTS = 5;

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);

  constructor(
    @InjectModel(Complaint.name)
    private readonly complaintModel: Model<ComplaintDocument>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateComplaintDto): Promise<ComplaintReceipt> {
    const complaint = await this.createWithCode(dto);

    // El registro ya es válido aunque el correo falle: nunca bloquear la hoja por SMTP
    try {
      await this.mailService.sendComplaintReceipt(complaint);
      await this.mailService.sendComplaintNotification(complaint);
    } catch (error) {
      this.logger.error(
        `No se pudieron enviar los correos de la hoja ${complaint.code}`,
        error instanceof Error ? error.stack : undefined,
      );
    }

    return {
      id: complaint._id.toString(),
      code: complaint.code,
      createdAt: complaint.get('createdAt') as Date,
    };
  }

  async findAll(status?: string): Promise<ComplaintDocument[]> {
    const filter = status ? { status } : {};
    return this.complaintModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findByCode(code: string): Promise<ComplaintDocument> {
    const complaint = await this.complaintModel
      .findOne({ code: code.trim().toUpperCase() })
      .exec();
    if (!complaint) {
      throw new NotFoundException('No existe una hoja de reclamación con ese código');
    }
    return complaint;
  }

  async update(
    id: string,
    changes: { status?: string; response?: string },
  ): Promise<ComplaintDocument> {
    const patch: Record<string, unknown> = { ...changes };
    if (changes.response) {
      patch.respondedAt = new Date();
    }

    const complaint = await this.complaintModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .exec();
    if (!complaint) {
      throw new NotFoundException('Hoja de reclamación no encontrada');
    }
    return complaint;
  }

  // El correlativo es por año; el índice único protege ante escrituras concurrentes
  private async createWithCode(
    dto: CreateComplaintDto,
  ): Promise<ComplaintDocument> {
    const year = new Date().getFullYear();
    const yearPrefix = `${CODE_PREFIX}-${year}-`;

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const count = await this.complaintModel.countDocuments({
        code: { $regex: `^${yearPrefix}` },
      });
      const code = `${yearPrefix}${String(count + 1 + attempt).padStart(6, '0')}`;

      try {
        return await this.complaintModel.create({ ...dto, code });
      } catch (error) {
        if (!this.isDuplicateKeyError(error) || attempt === MAX_CODE_ATTEMPTS - 1) {
          throw error;
        }
      }
    }

    throw new Error('No se pudo generar el correlativo de la hoja de reclamación');
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      (error as { code?: number }).code === 11000
    );
  }
}
