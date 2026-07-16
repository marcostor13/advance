import { Pipe, PipeTransform } from '@angular/core';

const SYMBOLS: Record<string, string> = { PEN: 'S/', USD: '$' };

@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'PEN', decimals = 2): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    const symbol = SYMBOLS[currency] ?? '';
    const formatted = value.toLocaleString('es-PE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${symbol} ${formatted}`.trim();
  }
}
