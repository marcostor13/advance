import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/api.models';

const TOKEN_KEY = 'ag_token';
const USER_KEY = 'ag_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _user = signal<User | null>(this.readStoredUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

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

  private persist(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._user.set(res.user);
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
