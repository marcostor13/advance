import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginPayload, RegisterPayload } from '../../../core/models/api.models';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-portal-auth',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './portal-auth.component.html',
  styleUrl: './portal-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalAuthComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly mode = signal<Mode>('login');
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected readonly registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    company: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) this.router.navigate(['/portal']);
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.error.set('');
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.loginForm.getRawValue() as LoginPayload).subscribe({
      next: () => this.router.navigate(['/portal']),
      error: (err: unknown) => this.fail(err, 'No pudimos iniciar sesión. Verifica tus credenciales.'),
    });
  }

  submitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const raw = this.registerForm.getRawValue();
    const payload: RegisterPayload = {
      name: raw.name ?? '',
      email: raw.email ?? '',
      phone: raw.phone ?? '',
      password: raw.password ?? '',
      ...(raw.company ? { company: raw.company } : {}),
    };
    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/portal']),
      error: (err: unknown) => this.fail(err, 'No pudimos crear tu cuenta. Intenta nuevamente.'),
    });
  }

  private fail(err: unknown, fallback: string): void {
    const msg =
      err instanceof Object && 'message' in err && (err as { message: unknown }).message
        ? String((err as { message: unknown }).message)
        : fallback;
    this.error.set(msg);
    this.loading.set(false);
  }
}
