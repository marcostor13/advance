import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  AdminStats,
  CreateUserPayload,
  CreatedUser,
  ImportSummary,
  Lead,
  LeadStatus,
  Movement,
  MovementPayload,
  Position,
  Product,
  ProductPayload,
  Quote,
  Simulation,
  UpdateUserPayload,
  User,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  stats(): Observable<AdminStats> {
    return this.api.get<AdminStats>('/admin/stats');
  }

  quotes(status?: LeadStatus | ''): Observable<Quote[]> {
    const q = status ? `?status=${status}` : '';
    return this.api.get<Quote[]>(`/admin/quotes${q}`);
  }

  updateQuote(id: string, changes: { status?: LeadStatus; notes?: string }): Observable<Quote> {
    return this.api.put<Quote>(`/admin/quotes/${id}`, changes);
  }

  simulations(status?: LeadStatus | ''): Observable<Simulation[]> {
    const q = status ? `?status=${status}` : '';
    return this.api.get<Simulation[]>(`/admin/simulations${q}`);
  }

  updateSimulation(id: string, changes: { status?: LeadStatus; notes?: string }): Observable<Simulation> {
    return this.api.put<Simulation>(`/admin/simulations/${id}`, changes);
  }

  leads(): Observable<Lead[]> {
    return this.api.get<Lead[]>('/admin/leads');
  }

  // ---- Users ----
  users(search?: string, role?: string): Observable<User[]> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (role) params.set('role', role);
    const q = params.toString();
    return this.api.get<User[]>(`/admin/users${q ? `?${q}` : ''}`);
  }

  createUser(payload: CreateUserPayload): Observable<CreatedUser> {
    return this.api.post<CreatedUser>('/admin/users', payload);
  }

  updateUser(id: string, payload: UpdateUserPayload): Observable<User> {
    return this.api.put<User>(`/admin/users/${id}`, payload);
  }

  deleteUser(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/users/${id}`);
  }

  userMovements(id: string): Observable<{ movements: Movement[]; positions: Position[] }> {
    return this.api.get<{ movements: Movement[]; positions: Position[] }>(`/admin/users/${id}/movements`);
  }

  // ---- Products ----
  products(): Observable<Product[]> {
    return this.api.get<Product[]>('/admin/products');
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.api.post<Product>('/admin/products', payload);
  }

  updateProduct(id: string, payload: Partial<ProductPayload> & { status?: string }): Observable<Product> {
    return this.api.put<Product>(`/admin/products/${id}`, payload);
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/products/${id}`);
  }

  // ---- Movements ----
  movements(filter: { user?: string; product?: string } = {}): Observable<Movement[]> {
    const params = new URLSearchParams();
    if (filter.user) params.set('user', filter.user);
    if (filter.product) params.set('product', filter.product);
    const q = params.toString();
    return this.api.get<Movement[]>(`/admin/movements${q ? `?${q}` : ''}`);
  }

  createMovement(payload: MovementPayload): Observable<Movement> {
    return this.api.post<Movement>('/admin/movements', payload);
  }

  updateMovement(id: string, payload: Partial<MovementPayload>): Observable<Movement> {
    return this.api.put<Movement>(`/admin/movements/${id}`, payload);
  }

  deleteMovement(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/movements/${id}`);
  }

  // ---- Import ----
  downloadTemplate(): Observable<Blob> {
    return this.api.getBlob('/admin/import/template');
  }

  importFile(file: File): Observable<ImportSummary> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.postForm<ImportSummary>('/admin/import', formData);
  }
}
