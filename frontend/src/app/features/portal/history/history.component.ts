import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import {
  INSTRUMENT_LABELS,
  Investment,
  MOVEMENT_LABELS,
  MovementType,
} from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

interface HistoryEntry {
  date: string;
  type: MovementType;
  amount: number;
  description: string;
  product: string;
  instrument: keyof typeof INSTRUMENT_LABELS;
  currency: string;
}

@Component({
  selector: 'app-portal-history',
  standalone: true,
  imports: [DatePipe, IconComponent, MoneyPipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnInit {
  private readonly portal = inject(PortalService);

  protected readonly movementLabels = MOVEMENT_LABELS;
  protected readonly investments = signal<Investment[]>([]);
  protected readonly loading = signal(true);

  protected readonly entries = computed<HistoryEntry[]>(() =>
    this.investments()
      .flatMap((inv) =>
        inv.movements.map((m) => ({
          date: m.date,
          type: m.type,
          amount: m.amount,
          description: m.description,
          product: inv.product,
          instrument: inv.instrument,
          currency: inv.currency,
        })),
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
  );

  ngOnInit(): void {
    this.portal.investments().subscribe({
      next: (data) => {
        this.investments.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  icon(type: MovementType): string {
    switch (type) {
      case 'deposit': return 'wallet';
      case 'interest': return 'trending-up';
      case 'maturity': return 'check-circle';
      default: return 'dollar-sign';
    }
  }
}
