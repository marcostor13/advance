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
  instrument: 'factoring',
  currency: 'PEN',
  amount: 50_000,
  termMonths: 12,
  annualRate: 12,
  compound: false,
  interestEarned: 6_000,
  finalAmount: 56_000,
  schedule: [
    { month: 1, interest: 500, balance: 50_500 },
    { month: 2, interest: 500, balance: 51_000 },
    { month: 3, interest: 500, balance: 51_500 },
    { month: 4, interest: 500, balance: 52_000 },
    { month: 5, interest: 500, balance: 52_500 },
    { month: 6, interest: 500, balance: 53_000 },
    { month: 7, interest: 500, balance: 53_500 },
    { month: 8, interest: 500, balance: 54_000 },
    { month: 9, interest: 500, balance: 54_500 },
    { month: 10, interest: 500, balance: 55_000 },
    { month: 11, interest: 500, balance: 55_500 },
    { month: 12, interest: 500, balance: 56_000 },
  ],
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

  it('defaults to factoring instrument', () => {
    expect(component.instrument()).toBe('factoring');
  });

  it('annualRate returns 12 for factoring', () => {
    component.setInstrument('factoring');
    expect(component.annualRate()).toBe(12);
  });

  it('annualRate returns 10 for leasing', () => {
    component.setInstrument('leasing');
    expect(component.annualRate()).toBe(10);
  });

  it('annualRate returns 14 for capital_estructurado', () => {
    component.setInstrument('capital_estructurado');
    expect(component.annualRate()).toBe(14);
  });

  it('interestPreview is amount * rate * term fraction', () => {
    component['amount'].set(50_000);
    component.setInstrument('factoring'); // 12%
    component.setTerm(12);
    expect(component.interestPreview()).toBe(6_000);
  });

  it('finalPreview equals amount + interestPreview', () => {
    component['amount'].set(50_000);
    component.setInstrument('factoring');
    component.setTerm(12);
    expect(component.finalPreview()).toBe(56_000);
  });

  it('setCurrency updates currency and currencySymbol', () => {
    component.setCurrency('USD');
    expect(component.currency()).toBe('USD');
    expect(component.currencySymbol()).toBe('$');
    component.setCurrency('PEN');
    expect(component.currencySymbol()).toBe('S/');
  });

  it('requestSimulation moves to step 2 when not authenticated', () => {
    Object.defineProperty(authServiceSpy, 'isAuthenticated', {
      get: () => (() => false),
    });
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
        interest: 500,
        balance: 50_000 + (i + 1) * 500,
      })),
    };
    component['simulation'].set(longSim);
    expect(component.visibleSchedule().length).toBe(12);
    component.toggleSchedule();
    expect(component.visibleSchedule().length).toBe(24);
  });

  it('barWidth returns 0 when simulation is null', () => {
    component['simulation'].set(null);
    expect(component.barWidth(50_000)).toBe(0);
  });

  it('barWidth returns correct percentage', () => {
    component['simulation'].set(MOCK_SIM);
    expect(component.barWidth(28_000)).toBe(50); // 28000 / 56000 = 50%
  });

  it('format returns currency-formatted string', () => {
    const result = component.format(1234.5, 'PEN');
    expect(result).toContain('1');
  });

  it('instrumentLabel returns label from INSTRUMENT_LABELS', () => {
    expect(component.instrumentLabel('factoring')).toBe('Factoring de Inversión');
    expect(component.instrumentLabel('leasing')).toBe('Leasing Financiero');
    expect(component.instrumentLabel('capital_estructurado')).toBe('Capital Estructurado');
  });
});
