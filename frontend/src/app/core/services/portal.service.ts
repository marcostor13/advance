import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Movement, PortalSummary, Position } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class PortalService {
  private readonly api = inject(ApiService);

  movements(): Observable<Movement[]> {
    return this.api.get<Movement[]>('/portal/movements');
  }

  positions(): Observable<Position[]> {
    return this.api.get<Position[]>('/portal/positions');
  }

  summary(): Observable<PortalSummary> {
    return this.api.get<PortalSummary>('/portal/summary');
  }
}
