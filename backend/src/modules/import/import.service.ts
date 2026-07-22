import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { MovementsService } from '../movements/movements.service';
import { MailService } from '../mail/mail.service';

export interface ImportSummary {
  usersCreated: number;
  usersUpdated: number;
  productsCreated: number;
  productsUpdated: number;
  movementsCreated: number;
  tempPasswords: { email: string; documentNumber: string; tempPassword: string }[];
  errors: { sheet: string; row: number; message: string }[];
}

const DOC_TYPES = ['DNI', 'CE', 'RUC', 'Pasaporte'];
const RISK_PROFILES = ['conservador', 'moderado', 'agresivo'];
const PRODUCT_TYPES = ['fondo', 'bono'];
const MOVEMENT_TYPES = ['SUSCRIPCIÓN', 'RENDIMIENTO', 'VENCIMIENTO'];

@Injectable()
export class ImportService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly movementsService: MovementsService,
    private readonly mailService: MailService,
  ) {}

  async buildTemplate(): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Advance Group';
    workbook.created = new Date();

    this.buildUsersSheet(workbook);
    this.buildProductsSheet(workbook);
    this.buildMovementsSheet(workbook);
    this.buildInstructionsSheet(workbook);

    return workbook.xlsx.writeBuffer();
  }

  async import(buffer: Buffer): Promise<ImportSummary> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);

    const summary: ImportSummary = {
      usersCreated: 0,
      usersUpdated: 0,
      productsCreated: 0,
      productsUpdated: 0,
      movementsCreated: 0,
      tempPasswords: [],
      errors: [],
    };

    await this.importUsers(workbook.getWorksheet('Usuarios'), summary);
    await this.importProducts(workbook.getWorksheet('Productos'), summary);
    await this.importMovements(workbook.getWorksheet('Movimientos'), summary);

    return summary;
  }

  // ---- Sheet builders ----------------------------------------------------

  private buildUsersSheet(workbook: ExcelJS.Workbook): void {
    const sheet = workbook.addWorksheet('Usuarios');
    sheet.columns = [
      { header: 'documento', key: 'documento', width: 16 },
      { header: 'tipoDocumento', key: 'tipoDocumento', width: 14 },
      { header: 'nombre', key: 'nombre', width: 18 },
      { header: 'apellidos', key: 'apellidos', width: 18 },
      { header: 'email', key: 'email', width: 26 },
      { header: 'telefono', key: 'telefono', width: 14 },
      { header: 'direccion', key: 'direccion', width: 26 },
      { header: 'distrito', key: 'distrito', width: 16 },
      { header: 'ciudad', key: 'ciudad', width: 16 },
      { header: 'banco', key: 'banco', width: 16 },
      { header: 'cuenta', key: 'cuenta', width: 20 },
      { header: 'cci', key: 'cci', width: 22 },
      { header: 'perfilRiesgo', key: 'perfilRiesgo', width: 16 },
    ];
    this.styleHeader(sheet);
    sheet.addRow({
      documento: 'EJEMPLO_ELIMINAR',
      tipoDocumento: 'DNI',
      nombre: 'Juan',
      apellidos: 'Pérez Gómez',
      email: 'juan.perez@correo.com',
      telefono: '987654321',
      direccion: 'Av. El Polo 695',
      distrito: 'Santiago de Surco',
      ciudad: 'Lima',
      banco: 'BCP',
      cuenta: '19412345678012',
      cci: '00219400123456780123',
      perfilRiesgo: 'moderado',
    });
    this.styleExampleRow(sheet, 2);
    this.addListValidation(sheet, 'B', DOC_TYPES);
    this.addListValidation(sheet, 'M', RISK_PROFILES);
  }

  private buildProductsSheet(workbook: ExcelJS.Workbook): void {
    const sheet = workbook.addWorksheet('Productos');
    sheet.columns = [
      { header: 'nombre', key: 'nombre', width: 32 },
      { header: 'tipo', key: 'tipo', width: 12 },
      { header: 'tasaAnual', key: 'tasaAnual', width: 12 },
      { header: 'plazoMeses', key: 'plazoMeses', width: 12 },
      { header: 'descripcion', key: 'descripcion', width: 32 },
    ];
    this.styleHeader(sheet);
    sheet.addRow({
      nombre: 'EJEMPLO_ELIMINAR — Fondo Factoring Corporativo',
      tipo: 'fondo',
      tasaAnual: 11,
      plazoMeses: 12,
      descripcion: 'Fondo de factoring corporativo diversificado',
    });
    this.styleExampleRow(sheet, 2);
    this.addListValidation(sheet, 'B', PRODUCT_TYPES);
  }

  private buildMovementsSheet(workbook: ExcelJS.Workbook): void {
    const sheet = workbook.addWorksheet('Movimientos');
    sheet.columns = [
      { header: 'documento', key: 'documento', width: 16 },
      { header: 'producto', key: 'producto', width: 32 },
      { header: 'tipoMovimiento', key: 'tipoMovimiento', width: 16 },
      { header: 'monto', key: 'monto', width: 14 },
      { header: 'fecha', key: 'fecha', width: 14 },
      { header: 'notas', key: 'notas', width: 26 },
    ];
    this.styleHeader(sheet);
    sheet.addRow({
      documento: 'EJEMPLO_ELIMINAR',
      producto: 'Fondo Factoring Corporativo',
      tipoMovimiento: 'SUSCRIPCIÓN',
      monto: 65000,
      fecha: '2026-02-15',
      notas: 'Suscripción inicial de capital',
    });
    this.styleExampleRow(sheet, 2);
    this.addListValidation(sheet, 'C', MOVEMENT_TYPES);
  }

  private buildInstructionsSheet(workbook: ExcelJS.Workbook): void {
    const sheet = workbook.addWorksheet('Instrucciones', { properties: { tabColor: { argb: 'FF1E3A5F' } } });
    sheet.columns = [{ width: 100 }];
    const lines = [
      'Plantilla de carga masiva — Advance Group',
      '',
      '1. Complete las hojas "Usuarios", "Productos" y "Movimientos".',
      '2. Elimine la fila marcada como EJEMPLO_ELIMINAR en cada hoja antes de importar.',
      '3. El "documento" (número de documento) es la clave que vincula usuarios, así que debe ser idéntico en las 3 hojas.',
      '4. Si un usuario no existe todavía, se crea automáticamente con una contraseña temporal que se le envía por correo y que deberá cambiar al iniciar sesión.',
      '5. El "producto" en la hoja Movimientos debe coincidir EXACTAMENTE con el "nombre" de un producto en la hoja Productos.',
      '6. tipoMovimiento admite: SUSCRIPCIÓN, RENDIMIENTO, VENCIMIENTO.',
      '7. La fecha debe tener el formato AAAA-MM-DD (ej. 2026-02-15).',
      '8. Puede volver a importar el mismo archivo más adelante: los usuarios y productos existentes se actualizan (no se duplican); los movimientos siempre se agregan como nuevos.',
    ];
    lines.forEach((line, i) => {
      const row = sheet.addRow([line]);
      if (i === 0) row.font = { bold: true, size: 14 };
    });
  }

  private styleHeader(sheet: ExcelJS.Worksheet): void {
    const header = sheet.getRow(1);
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    header.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
    });
  }

  private styleExampleRow(sheet: ExcelJS.Worksheet, rowNumber: number): void {
    const row = sheet.getRow(rowNumber);
    row.font = { italic: true, color: { argb: 'FF888888' } };
  }

  private addListValidation(sheet: ExcelJS.Worksheet, column: string, options: string[]): void {
    for (let i = 2; i <= 500; i++) {
      sheet.getCell(`${column}${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${options.join(',')}"`],
      };
    }
  }

  // ---- Import parsers ------------------------------------------------------

  private eachDataRow(sheet: ExcelJS.Worksheet | undefined, cb: (row: ExcelJS.Row, rowNumber: number) => Promise<void>): Promise<void[]> {
    if (!sheet) return Promise.resolve([]);
    const tasks: Promise<void>[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // header
      const first = this.cellText(row.getCell(1));
      if (!first || first.toUpperCase().startsWith('EJEMPLO')) return;
      tasks.push(cb(row, rowNumber));
    });
    return Promise.all(tasks);
  }

  private cellText(cell: ExcelJS.Cell): string {
    const v = cell.value;
    if (v === null || v === undefined) return '';
    if (typeof v === 'object' && 'text' in v) return String((v as { text: unknown }).text ?? '').trim();
    if (typeof v === 'object' && 'result' in v) return String((v as { result: unknown }).result ?? '').trim();
    return String(v).trim();
  }

  private cellDate(cell: ExcelJS.Cell): Date | null {
    const v = cell.value;
    if (v instanceof Date) return v;
    const text = this.cellText(cell);
    if (!text) return null;
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private async importUsers(sheet: ExcelJS.Worksheet | undefined, summary: ImportSummary): Promise<void> {
    await this.eachDataRow(sheet, async (row, rowNumber) => {
      try {
        const documentNumber = this.cellText(row.getCell(1));
        if (!documentNumber) throw new Error('documento es obligatorio');
        const name = this.cellText(row.getCell(3));
        const email = this.cellText(row.getCell(5));
        if (!name || !email) throw new Error('nombre y email son obligatorios');

        const { created, tempPassword, user } = await this.usersService.upsertByDocument({
          documentNumber,
          documentType: this.cellText(row.getCell(2)) || undefined,
          name,
          lastName: this.cellText(row.getCell(4)) || undefined,
          email,
          phone: this.cellText(row.getCell(6)) || undefined,
          address: this.cellText(row.getCell(7)) || undefined,
          district: this.cellText(row.getCell(8)) || undefined,
          city: this.cellText(row.getCell(9)) || undefined,
          bank: this.cellText(row.getCell(10)) || undefined,
          accountNumber: this.cellText(row.getCell(11)) || undefined,
          cci: this.cellText(row.getCell(12)) || undefined,
          riskProfile: (this.cellText(row.getCell(13)) || undefined) as
            | 'conservador'
            | 'moderado'
            | 'agresivo'
            | undefined,
        });

        if (created) {
          summary.usersCreated++;
          if (tempPassword) {
            summary.tempPasswords.push({ email, documentNumber, tempPassword });
            await this.mailService
              .sendTempPassword(email, tempPassword)
              .catch((err: Error) => summary.errors.push({ sheet: 'Usuarios', row: rowNumber, message: `Correo no enviado: ${err.message}` }));
          }
        } else {
          summary.usersUpdated++;
        }
        void user;
      } catch (err) {
        summary.errors.push({ sheet: 'Usuarios', row: rowNumber, message: (err as Error).message });
      }
    });
  }

  private async importProducts(sheet: ExcelJS.Worksheet | undefined, summary: ImportSummary): Promise<void> {
    await this.eachDataRow(sheet, async (row, rowNumber) => {
      try {
        const name = this.cellText(row.getCell(1));
        const type = this.cellText(row.getCell(2));
        if (!name) throw new Error('nombre es obligatorio');
        if (!PRODUCT_TYPES.includes(type)) throw new Error('tipo debe ser "fondo" o "bono"');

        const annualRate = Number(row.getCell(3).value);
        const termMonths = Number(row.getCell(4).value);
        if (!Number.isFinite(annualRate) || !Number.isFinite(termMonths)) {
          throw new Error('tasaAnual y plazoMeses deben ser numéricos');
        }

        const { created } = await this.productsService.upsertByName({
          name,
          type,
          annualRate,
          termMonths,
          description: this.cellText(row.getCell(5)) || undefined,
        });
        if (created) summary.productsCreated++;
        else summary.productsUpdated++;
      } catch (err) {
        summary.errors.push({ sheet: 'Productos', row: rowNumber, message: (err as Error).message });
      }
    });
  }

  private async importMovements(sheet: ExcelJS.Worksheet | undefined, summary: ImportSummary): Promise<void> {
    await this.eachDataRow(sheet, async (row, rowNumber) => {
      try {
        const documentNumber = this.cellText(row.getCell(1));
        const productName = this.cellText(row.getCell(2));
        const type = this.cellText(row.getCell(3));
        if (!documentNumber || !productName) throw new Error('documento y producto son obligatorios');
        if (!MOVEMENT_TYPES.includes(type)) {
          throw new Error('tipoMovimiento debe ser SUSCRIPCIÓN, RENDIMIENTO o VENCIMIENTO');
        }

        const amount = Number(row.getCell(4).value);
        if (!Number.isFinite(amount) || amount <= 0) throw new Error('monto debe ser numérico y mayor a 0');

        const date = this.cellDate(row.getCell(5));
        if (!date) throw new Error('fecha inválida (use AAAA-MM-DD)');

        const user = await this.usersService.findByDocument(documentNumber);
        if (!user) throw new Error(`no existe un usuario con documento ${documentNumber} (revise la hoja Usuarios)`);

        const product = await this.productsService.findByName(productName);
        if (!product) throw new Error(`no existe un producto llamado "${productName}" (revise la hoja Productos)`);

        await this.movementsService.create({
          user: (user._id as { toString(): string }).toString(),
          product: (product._id as { toString(): string }).toString(),
          type,
          amount,
          date: date.toISOString(),
          notes: this.cellText(row.getCell(6)) || undefined,
        });
        summary.movementsCreated++;
      } catch (err) {
        summary.errors.push({ sheet: 'Movimientos', row: rowNumber, message: (err as Error).message });
      }
    });
  }
}
