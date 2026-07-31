import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface ComplaintMailData {
  code: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  claimType: string;
  itemType: string;
  itemDescription: string;
  detail: string;
  request: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;
  private readonly frontendUrl: string;
  private readonly complaintsInbox: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    this.from = this.config.get<string>('MAIL_FROM') ?? 'Advance Group <no-reply@advancegroup.pe>';
    this.frontendUrl = (this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4200').split(',')[0].trim();
    this.complaintsInbox =
      this.config.get<string>('COMPLAINTS_EMAIL') ?? 'contacto@advance-factoring.com';

    if (!host || !user || !pass) {
      this.logger.warn('SMTP_HOST/SMTP_USER/SMTP_PASS not fully configured — emails will be logged, not sent');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(this.config.get<string>('SMTP_PORT') ?? 587),
      secure: false,
      auth: { user, pass },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`SMTP not configured — skipping email to ${to}: "${subject}"`);
      return;
    }
    await this.transporter.sendMail({ from: this.from, to, subject, html });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const link = `${this.frontendUrl}/reset-password?token=${token}`;
    await this.send(
      email,
      'Recupera tu contraseña — Advance Group',
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Recupera tu contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña en Advance Group.</p>
        <p><a href="${link}" style="display:inline-block;padding:12px 24px;background:#1E3A5F;color:#fff;text-decoration:none;border-radius:6px">Restablecer contraseña</a></p>
        <p>Este enlace vence en 1 hora. Si no solicitaste este cambio, ignora este correo.</p>
      </div>`,
    );
  }

  // Constancia al consumidor: la norma exige entregarle copia de la hoja registrada
  async sendComplaintReceipt(complaint: ComplaintMailData): Promise<void> {
    const e = MailService.escapeHtml;
    await this.send(
      complaint.email,
      `Hoja de reclamación ${e(complaint.code)} — Advance Group`,
      `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>Recibimos su ${e(complaint.claimType)}</h2>
        <p>Estimado(a) ${e(complaint.fullName)}, registramos su ${e(complaint.claimType)} en nuestro Libro de Reclamaciones virtual.</p>
        <p><strong>Código de hoja:</strong> ${e(complaint.code)}</p>
        ${this.complaintSummary(complaint)}
        <p>Le daremos respuesta en un plazo no mayor a 15 días hábiles, contados desde la fecha de este registro.</p>
        <p style="color:#5b6470;font-size:13px">Conserve este correo como constancia de su registro.</p>
      </div>`,
    );
  }

  async sendComplaintNotification(complaint: ComplaintMailData): Promise<void> {
    const e = MailService.escapeHtml;
    await this.send(
      this.complaintsInbox,
      `[Libro de Reclamaciones] ${e(complaint.code)} — ${e(complaint.claimType)}`,
      `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <h2>Nueva hoja registrada: ${e(complaint.code)}</h2>
        <p><strong>Consumidor:</strong> ${e(complaint.fullName)} (${e(complaint.documentType)} ${e(complaint.documentNumber)})</p>
        <p><strong>Contacto:</strong> ${e(complaint.email)} · ${e(complaint.phone)}</p>
        ${this.complaintSummary(complaint)}
        <p style="color:#b70016"><strong>Plazo de respuesta: 15 días hábiles.</strong></p>
      </div>`,
    );
  }

  private complaintSummary(complaint: ComplaintMailData): string {
    const e = MailService.escapeHtml;
    return `<p><strong>Tipo:</strong> ${e(complaint.claimType)} sobre ${e(complaint.itemType)}</p>
      <p><strong>Bien contratado:</strong> ${e(complaint.itemDescription)}</p>
      <p><strong>Detalle:</strong><br>${e(complaint.detail)}</p>
      <p><strong>Pedido del consumidor:</strong><br>${e(complaint.request)}</p>`;
  }

  // El contenido lo escribe el consumidor: nunca inyectarlo crudo en el HTML del correo
  private static escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>');
  }

  async sendTempPassword(email: string, tempPassword: string): Promise<void> {
    const link = `${this.frontendUrl}/admin/login`;
    await this.send(
      email,
      'Tu cuenta en Advance Group',
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Bienvenido a Advance Group</h2>
        <p>Se creó una cuenta para ti en el portal de inversionistas. Tu contraseña temporal es:</p>
        <p style="font-size:20px;font-weight:bold;letter-spacing:1px">${tempPassword}</p>
        <p>Deberás cambiarla al iniciar sesión por primera vez.</p>
        <p><a href="${link}" style="display:inline-block;padding:12px 24px;background:#1E3A5F;color:#fff;text-decoration:none;border-radius:6px">Iniciar sesión</a></p>
      </div>`,
    );
  }
}
