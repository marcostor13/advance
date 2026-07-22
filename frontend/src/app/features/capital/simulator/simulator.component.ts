import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { SimulationService } from '../../../core/services/simulation.service';
import {
  Instrument,
  INSTRUMENT_LABELS,
  ScheduleEntry,
  Simulation,
  SimulationRequest,
} from '../../../core/models/api.models';
import { AuthGateComponent } from '../../../shared/components/auth-gate/auth-gate.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

type Currency = 'PEN' | 'USD';
type TermMonths = 3 | 6 | 12 | 18 | 24 | 36;

// Bono: tasa fija. Fondo: tasa variable (referencial), oscila ±2-3 puntos porcentuales.
const ANNUAL_RATES: Record<Instrument, Record<Currency, number>> = {
  bono: { USD: 8, PEN: 10 },
  fondo: { USD: 8, PEN: 10 },
};

const RATE_VARIABILITY: Record<Instrument, number> = {
  bono: 0,
  fondo: 2.5,
};

const MIN_AMOUNTS: Record<Instrument, Record<Currency, number>> = {
  bono: { USD: 30_000, PEN: 100_000 },
  fondo: { USD: 10_000, PEN: 30_000 },
};

const MAX_AMOUNT = 5_000_000;
const SLIDER_MAX = 1_000_000;

@Component({
  selector: 'app-capital-simulator',
  standalone: true,
  imports: [AuthGateComponent, IconComponent],
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulatorComponent {
  private readonly simulationService = inject(SimulationService);
  private readonly auth = inject(AuthService);

  readonly maxAmount = MAX_AMOUNT;
  readonly sliderMax = SLIDER_MAX;
  readonly terms: readonly TermMonths[] = [3, 6, 12, 18, 24, 36];
  readonly stepsMeta = [
    { num: '01', label: 'Parámetros' },
    { num: '02', label: 'Sus datos' },
    { num: '03', label: 'Simulación' },
  ] as const;

  readonly instruments: { value: Instrument; label: string }[] = [
    { value: 'bono', label: INSTRUMENT_LABELS['bono'] },
    { value: 'fondo', label: INSTRUMENT_LABELS['fondo'] },
  ];

  readonly step = signal<1 | 2 | 3>(1);
  readonly instrument = signal<Instrument>('bono');
  readonly currency = signal<Currency>('USD');
  readonly amount = signal(MIN_AMOUNTS['bono']['USD']);
  readonly termMonths = signal<TermMonths>(12);
  readonly compound = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly simulation = signal<Simulation | null>(null);
  readonly showFullSchedule = signal(false);

  readonly minAmount = computed(() => MIN_AMOUNTS[this.instrument()][this.currency()]);
  readonly isVariableRate = computed(() => RATE_VARIABILITY[this.instrument()] > 0);
  readonly rateVariability = computed(() => RATE_VARIABILITY[this.instrument()]);
  readonly annualRate = computed(() => ANNUAL_RATES[this.instrument()][this.currency()]);
  readonly monthlyRate = computed(() => this.annualRate() / 12);
  readonly interestPreview = computed(
    () => this.amount() * (this.annualRate() / 100) * (this.termMonths() / 12),
  );
  readonly finalPreview = computed(() => this.amount() + this.interestPreview());
  readonly currencySymbol = computed(() => (this.currency() === 'PEN' ? 'S/' : '$'));
  readonly amountDisplay = computed(() =>
    this.amount() > 0 ? new Intl.NumberFormat('es-PE').format(this.amount()) : '',
  );
  readonly belowMinimum = computed(() => this.amount() < this.minAmount());
  readonly sliderValue = computed(() =>
    Math.min(Math.max(this.amount(), this.minAmount()), SLIDER_MAX),
  );

  readonly visibleSchedule = computed<ScheduleEntry[]>(() => {
    const sim = this.simulation();
    if (!sim) return [];
    const schedule = sim.schedule;
    if (!this.showFullSchedule() && sim.termMonths > 12) {
      return schedule.slice(0, 12);
    }
    return schedule;
  });

  setInstrument(i: Instrument): void {
    this.instrument.set(i);
    this.bumpToMinimum();
  }

  setCurrency(c: Currency): void {
    this.currency.set(c);
    this.bumpToMinimum();
  }

  private bumpToMinimum(): void {
    if (this.amount() < this.minAmount()) {
      this.amount.set(this.minAmount());
    }
  }

  setTerm(t: TermMonths): void {
    this.termMonths.set(t);
  }

  setCompound(v: boolean): void {
    this.compound.set(v);
  }

  onAmountInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.amount.set(raw ? Number(raw) : 0);
  }

  onSliderInput(event: Event): void {
    this.amount.set(Number((event.target as HTMLInputElement).value));
  }

  requestSimulation(): void {
    if (this.loading()) return;
    if (this.belowMinimum()) {
      this.error.set(
        `El monto mínimo para ${this.instrumentLabel(this.instrument())} en ${this.currency() === 'USD' ? 'dólares' : 'soles'} es ${this.format(this.minAmount())}.`,
      );
      return;
    }
    this.error.set('');
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
    this.step.set(1);
    this.error.set('');
  }

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    const payload: SimulationRequest = {
      instrument: this.instrument(),
      currency: this.currency(),
      amount: this.amount(),
      termMonths: this.termMonths(),
      compound: this.compound(),
    };
    this.simulationService.create(payload).subscribe({
      next: (sim) => {
        this.loading.set(false);
        this.simulation.set(sim);
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
    this.simulation.set(null);
    this.error.set('');
    this.showFullSchedule.set(false);
    this.step.set(1);
  }

  toggleSchedule(): void {
    this.showFullSchedule.update((v) => !v);
  }

  format(value: number, currency: Currency = this.currency()): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(value);
  }

  formatPlain(value: number): string {
    return new Intl.NumberFormat('es-PE').format(value);
  }

  instrumentLabel(value: Instrument): string {
    return INSTRUMENT_LABELS[value];
  }

  barWidth(balance: number): number {
    const sim = this.simulation();
    if (!sim || sim.finalAmount === 0) return 0;
    return Math.round((balance / sim.finalAmount) * 100);
  }

  private readError(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const inner = (err as { error?: { message?: unknown } }).error;
      if (inner && typeof inner.message === 'string') return inner.message;
    }
    return 'No pudimos generar su simulación. Inténtelo nuevamente.';
  }
}
