import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '../models/api.models';

const TOKEN_KEY = 'ag_token';
const USER_KEY = 'ag_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _user = signal<User | null>(this.readStoredUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'admin');
  readonly mustChangePassword = computed(() => this._user()?.mustChangePassword === true);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', payload).pipe(tap((res) => this.persist(res)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', payload).pipe(tap((res) => this.persist(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/auth/forgot-password', payload);
  }

  resetPassword(payload: ResetPasswordPayload): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/auth/reset-password', payload);
  }

  changePassword(payload: ChangePasswordPayload): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/auth/change-password', payload).pipe(
      tap(() => {
        const current = this._user();
        if (current) this.persistUser({ ...current, mustChangePassword: false });
      }),
    );
  }

  private persist(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.persistUser(res.user);
  }

  private persistUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
