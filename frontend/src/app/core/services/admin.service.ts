import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AdminStats, Lead, LeadStatus, Quote, Simulation } from '../models/api.models';

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
}
