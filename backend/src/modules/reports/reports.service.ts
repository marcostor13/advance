import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly model: Model<ReportDocument>,
  ) {}

  async findByUser(userId: string): Promise<ReportDocument[]> {
    const existing = await this.model.find({ user: userId }).sort({ publishedAt: -1 }).exec();
    if (existing.length > 0) return existing;
    await this.seedForUser(userId);
    return this.model.find({ user: userId }).sort({ publishedAt: -1 }).exec();
  }

  // Demo seed — statements & reports available on first portal access.
  private async seedForUser(userId: string): Promise<void> {
    const user = new Types.ObjectId(userId);
    const now = new Date();
    const month = 30 * 24 * 60 * 60 * 1000;

    const seeds = [
      {
        title: 'Estado de Cuenta — Trimestre Actual',
        type: 'quarterly',
        period: 'Q2 2026',
        summary: 'Resumen consolidado de posiciones, rendimientos y flujos del trimestre.',
        sizeKb: 342,
        offset: 0,
      },
      {
        title: 'Reporte Mensual de Rendimientos',
        type: 'monthly',
        period: 'Junio 2026',
        summary: 'Detalle de intereses devengados y valorización de instrumentos.',
        sizeKb: 189,
        offset: -1,
      },
      {
        title: 'Reporte Mensual de Rendimientos',
        type: 'monthly',
        period: 'Mayo 2026',
        summary: 'Detalle de intereses devengados y valorización de instrumentos.',
        sizeKb: 176,
        offset: -2,
      },
      {
        title: 'Constancia de Retención de Impuestos',
        type: 'statement',
        period: '2025',
        summary: 'Documento tributario anual para tu declaración de renta.',
        sizeKb: 98,
        offset: -6,
      },
      {
        title: 'Informe Anual del Portafolio',
        type: 'annual',
        period: '2025',
        summary: 'Balance completo del año: capital, rendimientos e indicadores.',
        sizeKb: 512,
        offset: -6,
      },
    ];

    const docs = seeds.map((s) => ({
      user,
      title: s.title,
      type: s.type,
      period: s.period,
      summary: s.summary,
      sizeKb: s.sizeKb,
      fileUrl: '#',
      publishedAt: new Date(now.getTime() + s.offset * month),
    }));

    await this.model.insertMany(docs);
  }
}
