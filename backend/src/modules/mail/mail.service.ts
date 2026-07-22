import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    this.from = this.config.get<string>('MAIL_FROM') ?? 'Advance Group <no-reply@advancegroup.pe>';
    this.frontendUrl = (this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:4200').split(',')[0].trim();

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
