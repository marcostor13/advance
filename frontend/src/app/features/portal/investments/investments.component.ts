import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import {
  INSTRUMENT_LABELS,
  INVESTMENT_STATUS_LABELS,
  Investment,
} from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-portal-investments',
  standalone: true,
  imports: [DatePipe, DecimalPipe, IconComponent, MoneyPipe],
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentsComponent implements OnInit {
  private readonly portal = inject(PortalService);

  protected readonly instrumentLabels = INSTRUMENT_LABELS;
  protected readonly statusLabels = INVESTMENT_STATUS_LABELS;

  protected readonly investments = signal<Investment[]>([]);
  protected readonly loading = signal(true);
  protected readonly filter = signal<'all' | 'active' | 'matured'>('all');

  protected readonly filtered = computed(() => {
    const f = this.filter();
    const list = this.investments();
    if (f === 'all') return list;
    return list.filter((i) => i.status === f);
  });

  ngOnInit(): void {
    this.portal.investments().subscribe({
      next: (data) => {
        this.investments.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setFilter(f: 'all' | 'active' | 'matured'): void {
    this.filter.set(f);
  }

  progress(inv: Investment): number {
    const start = +new Date(inv.startDate);
    const end = +new Date(inv.maturityDate);
    const now = Date.now();
    if (inv.status === 'matured' || now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  gain(inv: Investment): number {
    return inv.currentValue - inv.principal;
  }
}
