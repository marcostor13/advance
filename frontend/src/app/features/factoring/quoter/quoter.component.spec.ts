import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoterComponent } from './quoter.component';
import { QuoteService } from '../../../core/services/quote.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { Quote } from '../../../core/models/api.models';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const MOCK_QUOTE: Quote = {
  _id: 'q123',
  user: 'user1',
  currency: 'PEN',
  amount: 100_000,
  termDays: 60,
  advancePct: 0.9,
  monthlyRate: 0.015,
  advanceAmount: 90_000,
  discount: 2_700,
  commission: 300,
  netDisbursement: 87_000,
  retention: 10_000,
  status: 'nueva',
  createdAt: new Date().toISOString(),
};

describe('QuoterComponent', () => {
  let fixture: ComponentFixture<QuoterComponent>;
  let component: QuoterComponent;
  let quoteServiceSpy: jasmine.SpyObj<QuoteService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    quoteServiceSpy = jasmine.createSpyObj('QuoteService', ['create']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAdmin']);

    await TestBed.configureTestingModule({
      imports: [QuoterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: QuoteService, useValue: quoteServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts at step 1', () => {
    expect(component.step()).toBe(1);
  });

  it('defaults to PEN currency', () => {
    expect(component.currency()).toBe('PEN');
    expect(component.currencySymbol()).toBe('S/');
  });

  it('defaults to 60 day term', () => {
    expect(component.termDays()).toBe(60);
  });

  it('setCurrency updates currency and symbol', () => {
    component.setCurrency('USD');
    expect(component.currency()).toBe('USD');
    expect(component.currencySymbol()).toBe('$');
    component.setCurrency('PEN');
    expect(component.currencySymbol()).toBe('S/');
  });

  it('setTerm updates termDays', () => {
    component.setTerm(90);
    expect(component.termDays()).toBe(90);
  });

  it('monthlyRate matches expected rates per term', () => {
    component.setTerm(30);
    expect(component.monthlyRate()).toBeCloseTo(1.4);
    component.setTerm(45);
    expect(component.monthlyRate()).toBeCloseTo(1.45);
    component.setTerm(60);
    expect(component.monthlyRate()).toBeCloseTo(1.5);
    component.setTerm(90);
    expect(component.monthlyRate()).toBeCloseTo(1.6);
    component.setTerm(120);
    expect(component.monthlyRate()).toBeCloseTo(1.7);
  });

  it('advancePreview is 90% of amount', () => {
    component['amount'].set(100_000);
    expect(component.advancePreview()).toBe(90_000);
  });

  it('amountValid is true for value within range', () => {
    component['amount'].set(100_000);
    expect(component.amountValid()).toBeTrue();
  });

  it('amountValid is false below minimum', () => {
    component['amount'].set(500);
    expect(component.amountValid()).toBeFalse();
  });

  it('amountValid is false above maximum', () => {
    component['amount'].set(11_000_000);
    expect(component.amountValid()).toBeFalse();
  });

  it('requestQuote moves to step 2 when not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    component['amount'].set(100_000);
    component.requestQuote();
    expect(component.step()).toBe(2);
  });

  it('requestQuote calls submit directly when already authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    quoteServiceSpy.create.and.returnValue(of(MOCK_QUOTE));
    component['amount'].set(100_000);
    component.requestQuote();
    expect(quoteServiceSpy.create).toHaveBeenCalledTimes(1);
  });

  it('requestQuote does nothing when amount is invalid', () => {
    component['amount'].set(0);
    component.requestQuote();
    expect(component.step()).toBe(1);
    expect(quoteServiceSpy.create).not.toHaveBeenCalled();
  });

  it('goBack returns to step 1 and clears error', () => {
    component['step'].set(2);
    component['error'].set('error previo');
    component.goBack();
    expect(component.step()).toBe(1);
    expect(component.error()).toBe('');
  });

  it('submit calls quoteService.create and moves to step 3 on success', () => {
    quoteServiceSpy.create.and.returnValue(of(MOCK_QUOTE));
    component['amount'].set(100_000);
    component.submit();
    expect(quoteServiceSpy.create).toHaveBeenCalledTimes(1);
    expect(component.step()).toBe(3);
    expect(component.quote()).toEqual(MOCK_QUOTE);
    expect(component.loading()).toBeFalse();
  });

  it('submit sets error and stays at step 1 on API failure', () => {
    const apiErr = { error: { message: 'Error del servidor' } };
    quoteServiceSpy.create.and.returnValue(throwError(() => apiErr));
    component['amount'].set(100_000);
    component.submit();
    expect(component.error()).toBe('Error del servidor');
    expect(component.loading()).toBeFalse();
    expect(component.step()).toBe(1);
  });

  it('submit uses fallback error message when none provided', () => {
    quoteServiceSpy.create.and.returnValue(throwError(() => new Error('network')));
    component['amount'].set(100_000);
    component.submit();
    expect(component.error()).toBe('No pudimos generar su cotización. Inténtelo nuevamente.');
  });

  it('reset clears quote and returns to step 1', () => {
    component['quote'].set(MOCK_QUOTE);
    component['step'].set(3);
    component.reset();
    expect(component.quote()).toBeNull();
    expect(component.step()).toBe(1);
    expect(component.error()).toBe('');
  });

  it('onAmountInput sets amount from text input', () => {
    const event = { target: { value: '250,000' } } as unknown as Event;
    component.onAmountInput(event);
    expect(component.amount()).toBe(250000);
  });

  it('onAmountInput sets 0 for empty input', () => {
    const event = { target: { value: '' } } as unknown as Event;
    component.onAmountInput(event);
    expect(component.amount()).toBe(0);
  });

  it('onSliderInput sets amount from slider', () => {
    const event = { target: { value: '500000' } } as unknown as Event;
    component.onSliderInput(event);
    expect(component.amount()).toBe(500_000);
  });

  it('sliderValue clamps amount to sliderMax', () => {
    component['amount'].set(3_000_000);
    expect(component.sliderValue()).toBe(component.sliderMax);
  });

  it('sliderValue clamps amount to minAmount', () => {
    component['amount'].set(0);
    expect(component.sliderValue()).toBe(component.minAmount);
  });

  it('format returns PEN currency string', () => {
    const result = component.format(87_000, 'PEN');
    expect(result).toContain('87');
  });
});
