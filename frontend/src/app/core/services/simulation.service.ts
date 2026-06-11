import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Simulation, SimulationRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SimulationService {
  private readonly api = inject(ApiService);

  create(payload: SimulationRequest): Observable<Simulation> {
    return this.api.post<Simulation>('/simulations', payload);
  }

  mine(): Observable<Simulation[]> {
    return this.api.get<Simulation[]>('/simulations/mine');
  }
}
