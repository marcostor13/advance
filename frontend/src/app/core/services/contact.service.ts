import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly api = inject(ApiService);

  send(payload: ContactPayload): Observable<ContactResponse> {
    return this.api.post<ContactResponse>('/contact', payload);
  }
}
