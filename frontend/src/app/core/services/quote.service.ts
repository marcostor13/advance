import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Quote, QuoteRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly api = inject(ApiService);

  create(payload: QuoteRequest): Observable<Quote> {
    return this.api.post<Quote>('/quotes', payload);
  }

  mine(): Observable<Quote[]> {
    return this.api.get<Quote[]>('/quotes/mine');
  }
}
