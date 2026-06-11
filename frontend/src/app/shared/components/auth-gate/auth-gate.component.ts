import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Inline register/login gate. Emits `authed` once the visitor has a session,
 * so the host flow (quoter/simulator) can continue and persist its lead.
 */
@Component({
  selector: 'app-auth-gate',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-gate.component.html',
  styleUrl: './auth-gate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthGateComponent {
  readonly authed = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly mode = signal<'register' | 'login'>('register');
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected readonly registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    company: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  setMode(mode: 'register' | 'login'): void {
    this.mode.set(mode);
    this.error.set('');
  }

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.authed.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo crear la cuenta. Inténtelo nuevamente.');
      },
    });
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.authed.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Credenciales incorrectas.');
      },
    });
  }

  protected invalid(form: 'register' | 'login', control: string): boolean {
    const c: AbstractControl | null =
      form === 'register' ? this.registerForm.get(control) : this.loginForm.get(control);
    return !!c && c.invalid && c.touched;
  }
}
