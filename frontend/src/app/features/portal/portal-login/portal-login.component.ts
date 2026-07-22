import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { extractErrorMessage } from '../../../core/utils/http-error';

@Component({
  selector: 'app-portal-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './portal-login.component.html',
  styleUrl: './portal-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalLoginComponent implements OnInit {
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
    if (this.auth.isAuthenticated()) {
      this.router.navigate([this.auth.isAdmin() ? '/admin' : '/portal']);
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
        if (this.auth.mustChangePassword()) {
          this.router.navigate(['/change-password']);
        } else {
          this.router.navigate([this.auth.isAdmin() ? '/admin' : '/portal']);
        }
      },
      error: (err: unknown) => {
        this.error.set(extractErrorMessage(err, 'Error al iniciar sesión.'));
        this.loading.set(false);
      },
    });
  }
}
