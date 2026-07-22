import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { PortalService } from '../../../core/services/portal.service';
import { AuthService } from '../../../core/services/auth.service';
import { Movement, MovementType, PortalSummary, Position } from '../../../core/models/api.models';

const POSITIVE_TYPES: MovementType[] = ['RENDIMIENTO', 'VENCIMIENTO'];
const ICONS: Record<MovementType, string> = {
  RENDIMIENTO: 'trending-up',
  SUSCRIPCIÓN: 'file-text',
  VENCIMIENTO: 'check-circle',
};

@Component({
  selector: 'app-portal-resumen',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenComponent implements OnInit {
  private readonly portal = inject(PortalService);
  private readonly auth = inject(AuthService);

  protected readonly firstName = computed(() => this.auth.user()?.name ?? 'Inversionista');

  private readonly summaryData = signal<PortalSummary | null>(null);
  private readonly movements = signal<Movement[]>([]);
  private readonly positions = signal<Position[]>([]);
  protected readonly loading = signal(true);

  protected readonly stats = computed(() => {
    const s = this.summaryData();
    if (!s) return [];
    return [
      { label: 'Capital invertido', value: this.currency(s.capitalInvertido), icon: 'briefcase' },
      { label: 'Rendimiento acumulado', value: this.currency(s.rendimientoAcumulado), icon: 'trending-up', accent: true },
      { label: 'Rentabilidad anual', value: `${s.rentabilidadAnual.toFixed(1)}%`, icon: 'percent' },
      { label: 'Inversiones activas', value: String(s.inversionesActivas), icon: 'layers' },
    ];
  });

  protected readonly allocations = computed(() => {
    const s = this.summaryData();
    if (!s) return [];
    return s.allocations.map((a) => ({ name: a.name, amount: this.currency(a.amount), pct: a.pct }));
  });

  protected readonly recent = computed(() =>
    [...this.movements()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4)
      .map((m) => ({
        icon: ICONS[m.type],
        positive: POSITIVE_TYPES.includes(m.type),
        title: `${m.type === 'RENDIMIENTO' ? 'Rendimiento devengado' : m.type === 'SUSCRIPCIÓN' ? 'Suscripción de capital' : 'Vencimiento de capital'}`,
        meta: `${typeof m.product === 'object' ? m.product.name : ''} · ${this.formatDate(m.date)}`,
        amount: this.formatAmount(m.amount),
      })),
  );

  protected readonly nextMaturity = computed(() => {
    const upcoming = this.positions()
      .filter((p) => p.capital > 0 && p.maturity)
      .sort((a, b) => new Date(a.maturity as string).getTime() - new Date(b.maturity as string).getTime());
    const next = upcoming[0];
    if (!next) return null;
    return {
      name: next.product.name,
      meta: `Vence el ${this.formatDate(next.maturity as string)} · capital + rendimientos`,
      amount: this.currency(next.capital + next.earned),
    };
  });

  ngOnInit(): void {
    this.portal.summary().subscribe({ next: (s) => this.summaryData.set(s) });
    this.portal.positions().subscribe({ next: (p) => this.positions.set(p) });
    this.portal.movements().subscribe({
      next: (m) => {
        this.movements.set(m);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private currency(value: number): string {
    return `S/ ${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
  }

  private formatAmount(value: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(value),
    );
  }
}
