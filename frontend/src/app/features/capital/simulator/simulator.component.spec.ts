import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulatorComponent } from './simulator.component';
import { SimulationService } from '../../../core/services/simulation.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { Simulation } from '../../../core/models/api.models';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const MOCK_SIM: Simulation = {
  _id: 'abc123',
  user: 'user1',
  instrument: 'bono',
  currency: 'USD',
  amount: 30_000,
  termMonths: 12,
  annualRate: 8,
  compound: false,
  interestEarned: 2_400,
  finalAmount: 32_400,
  schedule: Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    interest: 200,
    balance: 30_000 + (i + 1) * 200,
  })),
  status: 'nueva',
  createdAt: new Date().toISOString(),
};

describe('SimulatorComponent', () => {
  let fixture: ComponentFixture<SimulatorComponent>;
  let component: SimulatorComponent;
  let simulationServiceSpy: jasmine.SpyObj<SimulationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    simulationServiceSpy = jasmine.createSpyObj('SimulationService', ['create']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: signal(false),
    });

    await TestBed.configureTestingModule({
      imports: [SimulatorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SimulationService, useValue: simulationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts at step 1', () => {
    expect(component.step()).toBe(1);
  });

  it('defaults to bono instrument in USD at the minimum amount', () => {
    expect(component.instrument()).toBe('bono');
    expect(component.currency()).toBe('USD');
    expect(component.amount()).toBe(30_000);
  });

  it('annualRate is 8% for bono/USD and 10% for bono/PEN', () => {
    component.setInstrument('bono');
    component.setCurrency('USD');
    expect(component.annualRate()).toBe(8);
    component.setCurrency('PEN');
    expect(component.annualRate()).toBe(10);
  });

  it('annualRate is 8% for fondo/USD and 10% for fondo/PEN, and marked variable', () => {
    component.setInstrument('fondo');
    component.setCurrency('USD');
    expect(component.annualRate()).toBe(8);
    expect(component.isVariableRate()).toBeTrue();
    component.setCurrency('PEN');
    expect(component.annualRate()).toBe(10);
  });

  it('bono is a fixed rate (not variable)', () => {
    component.setInstrument('bono');
    expect(component.isVariableRate()).toBeFalse();
  });

  it('minAmount reflects instrument + currency minimums', () => {
    component.setInstrument('bono');
    component.setCurrency('USD');
    expect(component.minAmount()).toBe(30_000);
    component.setCurrency('PEN');
    expect(component.minAmount()).toBe(100_000);
    component.setInstrument('fondo');
    component.setCurrency('USD');
    expect(component.minAmount()).toBe(10_000);
    component.setCurrency('PEN');
    expect(component.minAmount()).toBe(30_000);
  });

  it('switching instrument/currency bumps amount up to the new minimum', () => {
    component.setInstrument('fondo');
    component.setCurrency('USD'); // min 10,000
    component['amount'].set(10_000);
    component.setCurrency('PEN'); // min 30,000 — should bump up
    expect(component.amount()).toBe(30_000);
  });

  it('interestPreview is amount * rate * term fraction', () => {
    component.setInstrument('bono');
    component.setCurrency('USD');
    component['amount'].set(30_000);
    component.setTerm(12);
    expect(component.interestPreview()).toBe(2_400);
  });

  it('finalPreview equals amount + interestPreview', () => {
    component.setInstrument('bono');
    component.setCurrency('USD');
    component['amount'].set(30_000);
    component.setTerm(12);
    expect(component.finalPreview()).toBe(32_400);
  });

  it('setCurrency updates currency and currencySymbol', () => {
    component.setCurrency('USD');
    expect(component.currency()).toBe('USD');
    expect(component.currencySymbol()).toBe('$');
    component.setCurrency('PEN');
    expect(component.currencySymbol()).toBe('S/');
  });

  it('requestSimulation blocks and sets an error when below the minimum amount', () => {
    component.setInstrument('bono');
    component.setCurrency('USD');
    component['amount'].set(1_000); // below 30,000 minimum
    component.requestSimulation();
    expect(component.step()).toBe(1);
    expect(component.error()).toContain('mínimo');
  });

  it('requestSimulation moves to step 2 when not authenticated and amount is valid', () => {
    Object.defineProperty(authServiceSpy, 'isAuthenticated', {
      get: () => (() => false),
    });
    component.setInstrument('bono');
    component.setCurrency('USD');
    component['amount'].set(30_000);
    component.requestSimulation();
    expect(component.step()).toBe(2);
  });

  it('goBack returns to step 1 and clears error', () => {
    component['step'].set(2);
    component['error'].set('some error');
    component.goBack();
    expect(component.step()).toBe(1);
    expect(component.error()).toBe('');
  });

  it('submit calls simulationService.create and sets step 3 on success', () => {
    simulationServiceSpy.create.and.returnValue(of(MOCK_SIM));
    component.submit();
    expect(simulationServiceSpy.create).toHaveBeenCalledTimes(1);
    expect(component.step()).toBe(3);
    expect(component.simulation()).toEqual(MOCK_SIM);
    expect(component.loading()).toBe(false);
  });

  it('submit sets error message on API failure', () => {
    const apiErr = { error: { message: 'Servicio no disponible' } };
    simulationServiceSpy.create.and.returnValue(throwError(() => apiErr));
    component.submit();
    expect(component.error()).toBe('Servicio no disponible');
    expect(component.step()).toBe(1);
    expect(component.loading()).toBe(false);
  });

  it('reset clears simulation and returns to step 1', () => {
    component['simulation'].set(MOCK_SIM);
    component['step'].set(3);
    component.reset();
    expect(component.simulation()).toBeNull();
    expect(component.step()).toBe(1);
  });

  it('toggleSchedule flips showFullSchedule', () => {
    expect(component.showFullSchedule()).toBeFalse();
    component.toggleSchedule();
    expect(component.showFullSchedule()).toBeTrue();
    component.toggleSchedule();
    expect(component.showFullSchedule()).toBeFalse();
  });

  it('visibleSchedule returns all entries when termMonths <= 12', () => {
    component['simulation'].set(MOCK_SIM);
    expect(component.visibleSchedule().length).toBe(12);
  });

  it('visibleSchedule returns first 12 entries for longer terms when not expanded', () => {
    const longSim: Simulation = {
      ...MOCK_SIM,
      termMonths: 24,
      schedule: Array.from({ length: 24 }, (_, i) => ({
        month: i + 1,
        interest: 200,
        balance: 30_000 + (i + 1) * 200,
      })),
    };
    component['simulation'].set(longSim);
    expect(component.visibleSchedule().length).toBe(12);
    component.toggleSchedule();
    expect(component.visibleSchedule().length).toBe(24);
  });

  it('barWidth returns 0 when simulation is null', () => {
    component['simulation'].set(null);
    expect(component.barWidth(30_000)).toBe(0);
  });

  it('barWidth returns correct percentage', () => {
    component['simulation'].set(MOCK_SIM);
    expect(component.barWidth(16_200)).toBe(50); // 16200 / 32400 = 50%
  });

  it('format returns currency-formatted string', () => {
    const result = component.format(1234.5, 'PEN');
    expect(result).toContain('1');
  });

  it('instrumentLabel returns label from INSTRUMENT_LABELS', () => {
    expect(component.instrumentLabel('bono')).toBe('Bono');
    expect(component.instrumentLabel('fondo')).toBe('Fondo');
  });
});
