import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ComplaintService } from '../../core/services/complaint.service';
import { ComplaintsBookComponent } from './complaints-book.component';

describe('ComplaintsBookComponent', () => {
  let component: ComplaintsBookComponent;
  let fixture: ComponentFixture<ComplaintsBookComponent>;
  let serviceSpy: jasmine.SpyObj<ComplaintService>;

  const validPayload = {
    fullName: 'Sandra Torres',
    documentType: 'DNI',
    documentNumber: '12345678',
    email: 'sandra@example.com',
    phone: '987654321',
    address: 'Av. El Derby 055',
    district: 'Santiago de Surco',
    province: 'Lima',
    department: 'Lima',
    itemType: 'servicio',
    itemDescription: 'Operación de factoring',
    currency: 'PEN',
    claimType: 'reclamo',
    detail: 'El desembolso no se realizó en la fecha acordada.',
    request: 'Solicito el desembolso inmediato.',
    accepted: true,
  };

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj<ComplaintService>('ComplaintService', ['send']);

    await TestBed.configureTestingModule({
      imports: [ComplaintsBookComponent],
      providers: [{ provide: ComplaintService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplaintsBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fillValidForm(): void {
    component['form'].patchValue(validPayload);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the three sections required by the Libro de Reclamaciones', () => {
    const blocks = fixture.nativeElement.querySelectorAll('.lr__block');
    expect(blocks.length).toBe(3);
  });

  it('starts invalid and does not submit an empty form', () => {
    component['submit']();
    expect(serviceSpy.send).not.toHaveBeenCalled();
  });

  it('requires the guardian name only when the consumer is a minor', () => {
    const guardian = component['form'].controls.guardianName;
    expect(guardian.valid).toBeTrue();

    component['form'].controls.isMinor.setValue(true);
    expect(guardian.valid).toBeFalse();

    component['form'].controls.isMinor.setValue(false);
    expect(guardian.valid).toBeTrue();
  });

  it('requires the consent checkbox', () => {
    fillValidForm();
    component['form'].controls.accepted.setValue(false);
    expect(component['form'].valid).toBeFalse();

    component['form'].controls.accepted.setValue(true);
    expect(component['form'].valid).toBeTrue();
  });

  it('omits optional fields that were left empty', () => {
    serviceSpy.send.and.returnValue(
      of({ id: '1', code: 'LR-2026-000001', createdAt: '2026-07-31T12:00:00Z' }),
    );
    fillValidForm();

    component['submit']();

    const payload = serviceSpy.send.calls.mostRecent().args[0];
    expect(payload.guardianName).toBeUndefined();
    expect(payload.claimedAmount).toBeUndefined();
    expect(payload.isMinor).toBeFalse();
  });

  it('shows the sheet code returned by the API on success', () => {
    serviceSpy.send.and.returnValue(
      of({ id: '1', code: 'LR-2026-000042', createdAt: '2026-07-31T12:00:00Z' }),
    );
    fillValidForm();

    component['submit']();
    fixture.detectChanges();

    expect(component['status']()).toBe('success');
    const code = fixture.nativeElement.querySelector('.lr__receipt-code');
    expect(code?.textContent).toContain('LR-2026-000042');
  });

  it('surfaces an error message when the API fails', () => {
    serviceSpy.send.and.returnValue(throwError(() => new Error('boom')));
    fillValidForm();

    component['submit']();
    fixture.detectChanges();

    expect(component['status']()).toBe('error');
    expect(fixture.nativeElement.querySelector('.lr__alert')).toBeTruthy();
  });
});
