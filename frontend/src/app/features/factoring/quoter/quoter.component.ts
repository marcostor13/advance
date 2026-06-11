import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { QuoteService } from '../../../core/services/quote.service';
import { Quote, QuoteRequest } from '../../../core/models/api.models';
import { AuthGateComponent } from '../../../shared/components/auth-gate/auth-gate.component';
import { ScrollAnimateDirective } from '../../../core/directives/scroll-animate.directive';
import { IconComponent } from '../../../shared/components/icon/icon.component';

type Currency = QuoteRequest['currency'];
type TermDays = QuoteRequest['termDays'];

const MIN_AMOUNT = 1_000;
const MAX_AMOUNT = 10_000_000;
const SLIDER_MAX = 2_000_000;
const ADVANCE_PCT = 0.9;

// Client-side mirror of server rates — referential only.
const MONTHLY_RATES: Record<TermDays, number> = { 30: 1.4, 45: 1.45, 60: 1.5, 90: 1.6, 120: 1.7 };

@Component({
  selector: 'app-factoring-quoter',
  standalone: true,
  imports: [AuthGateComponent, ScrollAnimateDirective, IconComponent],
  templateUrl: './quoter.component.html',
  styleUrl: './quoter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoterComponent {
  private readonly quotes = inject(QuoteService);
  private readonly auth = inject(AuthService);

  readonly minAmount = MIN_AMOUNT;
  readonly maxAmount = MAX_AMOUNT;
  readonly sliderMax = SLIDER_MAX;
  readonly terms: readonly TermDays[] = [30, 45, 60, 90, 120];
  readonly stepsMeta = [
    { num: '01', label: 'Datos de la factura' },
    { num: '02', label: 'Sus datos' },
    { num: '03', label: 'Cotización' },
  ] as const;

  readonly step = signal<1 | 2 | 3>(1);
  readonly currency = signal<Currency>('PEN');
  readonly amount = signal(100_000);
  readonly termDays = signal<TermDays>(60);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly quote = signal<Quote | null>(null);

  readonly amountValid = computed(() => this.amount() >= MIN_AMOUNT && this.amount() <= MAX_AMOUNT);
  readonly monthlyRate = computed(() => MONTHLY_RATES[this.termDays()]);
  readonly advancePreview = computed(() => this.amount() * ADVANCE_PCT);
  readonly currencySymbol = computed(() => (this.currency() === 'PEN' ? 'S/' : '$'));
  readonly amountDisplay = computed(() =>
    this.amount() > 0 ? new Intl.NumberFormat('es-PE').format(this.amount()) : '',
  );
  readonly sliderValue = computed(() => Math.min(Math.max(this.amount(), MIN_AMOUNT), SLIDER_MAX));

  setCurrency(currency: Currency): void {
    this.currency.set(currency);
  }

  setTerm(term: TermDays): void {
    this.termDays.set(term);
  }

  onAmountInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.amount.set(raw ? Number(raw) : 0);
  }

  onSliderInput(event: Event): void {
    this.amount.set(Number((event.target as HTMLInputElement).value));
  }

  requestQuote(): void {
    if (!this.amountValid() || this.loading()) {
      return;
    }
    if (this.auth.isAuthenticated()) {
      this.submit();
    } else {
      this.step.set(2);
    }
  }

  onAuthed(): void {
    this.submit();
  }

  goBack(): void {
    this.error.set('');
    this.step.set(1);
  }

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    const payload: QuoteRequest = {
      currency: this.currency(),
      amount: this.amount(),
      termDays: this.termDays(),
    };
    this.quotes.create(payload).subscribe({
      next: (quote) => {
        this.loading.set(false);
        this.quote.set(quote);
        this.step.set(3);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(this.readError(err));
        this.step.set(1);
      },
    });
  }

  reset(): void {
    this.quote.set(null);
    this.error.set('');
    this.step.set(1);
  }

  format(value: number, currency: Currency = this.currency()): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(value);
  }

  private readError(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const inner = (err as { error?: { message?: unknown } }).error;
      if (inner && typeof inner.message === 'string') {
        return inner.message;
      }
    }
    return 'No pudimos generar su cotización. Inténtelo nuevamente.';
  }
}
