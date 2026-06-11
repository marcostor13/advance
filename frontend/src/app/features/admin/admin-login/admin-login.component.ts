import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly error = signal('');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.auth.isAuthenticated() && this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.auth.logout();
          this.error.set('Acceso denegado. Solo administradores.');
          this.loading.set(false);
        }
      },
      error: (err: unknown) => {
        const msg =
          err instanceof Object && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Error al iniciar sesión.';
        this.error.set(msg);
        this.loading.set(false);
      },
    });
  }
}
