import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ComplaintPayload,
  ComplaintService,
} from '../../core/services/complaint.service';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { TextRevealDirective } from '../../core/directives/text-reveal.directive';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-complaints-book',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, ScrollAnimateDirective, TextRevealDirective],
  templateUrl: './complaints-book.component.html',
  styleUrl: './complaints-book.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintsBookComponent {
  private readonly fb = inject(FormBuilder);
  private readonly complaintService = inject(ComplaintService);

  protected readonly status = signal<FormStatus>('idle');
  protected readonly code = signal<string | null>(null);

  protected readonly today = new Date();

  protected readonly documentTypes = ['DNI', 'CE', 'PASAPORTE', 'RUC'] as const;

  protected readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    documentType: ['DNI', Validators.required],
    documentNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    district: ['', Validators.required],
    province: ['', Validators.required],
    department: ['', Validators.required],
    isMinor: [false],
    guardianName: [''],
    itemType: ['servicio', Validators.required],
    itemDescription: ['', Validators.required],
    claimedAmount: [null as number | null],
    currency: ['PEN', Validators.required],
    claimType: ['reclamo', Validators.required],
    detail: ['', [Validators.required, Validators.minLength(20)]],
    request: ['', [Validators.required, Validators.minLength(10)]],
    accepted: [false, Validators.requiredTrue],
  });

  private readonly claimTypeValue = toSignal(
    this.form.controls.claimType.valueChanges,
    { initialValue: 'reclamo' },
  );

  protected readonly isMinor = toSignal(this.form.controls.isMinor.valueChanges, {
    initialValue: false,
  });

  protected readonly claimTypeHint = computed(() =>
    this.claimTypeValue() === 'queja'
      ? 'Queja: disconformidad no relacionada a los productos o servicios, o malestar respecto a la atención recibida.'
      : 'Reclamo: disconformidad relacionada a los productos o servicios contratados.',
  );

  constructor() {
    // El apoderado sólo es obligatorio para consumidores menores de edad
    this.form.controls.isMinor.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((isMinor) => {
        const guardian = this.form.controls.guardianName;
        guardian.setValidators(isMinor ? [Validators.required] : []);
        guardian.updateValueAndValidity();
      });
  }

  protected isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('loading');

    const raw = this.form.getRawValue();
    const payload: ComplaintPayload = {
      fullName: raw.fullName!,
      documentType: raw.documentType as ComplaintPayload['documentType'],
      documentNumber: raw.documentNumber!,
      email: raw.email!,
      phone: raw.phone!,
      address: raw.address!,
      district: raw.district!,
      province: raw.province!,
      department: raw.department!,
      isMinor: !!raw.isMinor,
      itemType: raw.itemType as ComplaintPayload['itemType'],
      itemDescription: raw.itemDescription!,
      currency: raw.currency as ComplaintPayload['currency'],
      claimType: raw.claimType as ComplaintPayload['claimType'],
      detail: raw.detail!,
      request: raw.request!,
    };

    if (raw.isMinor && raw.guardianName) {
      payload.guardianName = raw.guardianName;
    }
    if (raw.claimedAmount !== null && raw.claimedAmount !== undefined) {
      payload.claimedAmount = Number(raw.claimedAmount);
    }

    this.complaintService.send(payload).subscribe({
      next: (receipt) => {
        this.code.set(receipt.code);
        this.status.set('success');
        this.form.reset({
          documentType: 'DNI',
          itemType: 'servicio',
          currency: 'PEN',
          claimType: 'reclamo',
          isMinor: false,
          accepted: false,
        });
      },
      error: () => this.status.set('error'),
    });
  }
}
