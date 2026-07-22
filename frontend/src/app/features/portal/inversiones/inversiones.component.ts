import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { PortalService } from '../../../core/services/portal.service';
import { Position } from '../../../core/models/api.models';

interface InvestmentView {
  name: string;
  type: 'fondo' | 'bono';
  status: 'Activo' | 'Finalizado';
  capital: string;
  rate: string;
  term: string;
  earned: string;
  maturity: string;
  progress: number;
}

@Component({
  selector: 'app-portal-inversiones',
  standalone: true,
  imports: [],
  templateUrl: './inversiones.component.html',
  styleUrl: './inversiones.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InversionesComponent implements OnInit {
  private readonly portal = inject(PortalService);

  private readonly positions = signal<Position[]>([]);
  protected readonly loading = signal(true);

  protected readonly investments = computed<InvestmentView[]>(() =>
    this.positions().map((p) => ({
      name: p.product.name,
      type: p.product.type,
      status: p.capital > 0 ? 'Activo' : 'Finalizado',
      capital: this.formatCurrency(p.capital),
      rate: `${p.product.annualRate}% anual`,
      term: `${p.product.termMonths} meses`,
      earned: this.formatCurrency(p.earned),
      maturity: p.maturity ? this.formatDate(p.maturity) : '—',
      progress: p.progress,
    })),
  );

  ngOnInit(): void {
    this.portal.positions().subscribe({
      next: (data) => {
        this.positions.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private formatCurrency(value: number): string {
    return `S/ ${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(value),
    );
  }
}
