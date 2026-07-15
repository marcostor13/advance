import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Investment, PortfolioSummary, Report } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class PortalService {
  private readonly api = inject(ApiService);

  investments(): Observable<Investment[]> {
    return this.api.get<Investment[]>('/investments/mine');
  }

  summary(): Observable<PortfolioSummary> {
    return this.api.get<PortfolioSummary>('/investments/summary');
  }

  reports(): Observable<Report[]> {
    return this.api.get<Report[]>('/reports/mine');
  }
}
