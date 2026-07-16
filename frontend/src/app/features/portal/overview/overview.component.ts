import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortalService } from '../../../core/services/portal.service';
import { NewsService } from '../../../core/services/news.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  INSTRUMENT_LABELS,
  Investment,
  Movement,
  NewsArticle,
  PortfolioSummary,
} from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

interface RecentMovement extends Movement {
  product: string;
  currency: string;
}

@Component({
  selector: 'app-portal-overview',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, IconComponent, MoneyPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  private readonly portal = inject(PortalService);
  private readonly news = inject(NewsService);
  private readonly auth = inject(AuthService);

  protected readonly instrumentLabels = INSTRUMENT_LABELS;

  protected readonly summary = signal<PortfolioSummary | null>(null);
  protected readonly investments = signal<Investment[]>([]);
  protected readonly latestNews = signal<NewsArticle[]>([]);
  protected readonly loading = signal(true);

  protected readonly firstName = computed(() => this.auth.user()?.name?.split(' ')[0] ?? '');

  protected readonly activeInvestments = computed(() =>
    this.investments().filter((i) => i.status === 'active'),
  );

  protected readonly recentMovements = computed<RecentMovement[]>(() =>
    this.investments()
      .flatMap((inv) =>
        inv.movements.map((m) => ({ ...m, product: inv.product, currency: inv.currency })),
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 6),
  );

  protected readonly allocation = computed(() => {
    const s = this.summary();
    if (!s || s.currentValue <= 0) return [];
    return s.byInstrument
      .map((b) => ({
        instrument: b.instrument,
        value: b.value,
        pct: Math.round((b.value / s.currentValue) * 100),
      }))
      .sort((a, b) => b.value - a.value);
  });

  ngOnInit(): void {
    this.portal.summary().subscribe({ next: (s) => this.summary.set(s) });
    this.portal.investments().subscribe({
      next: (data) => {
        this.investments.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.news.list().subscribe({ next: (n) => this.latestNews.set(n.slice(0, 3)) });
  }

  movementIcon(type: string): string {
    switch (type) {
      case 'deposit': return 'wallet';
      case 'interest': return 'trending-up';
      case 'maturity': return 'check-circle';
      default: return 'dollar-sign';
    }
  }
}
