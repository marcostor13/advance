import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export type ComplaintDocumentType = 'DNI' | 'CE' | 'PASAPORTE' | 'RUC';
export type ComplaintItemType = 'producto' | 'servicio';
export type ComplaintClaimType = 'reclamo' | 'queja';

export interface ComplaintPayload {
  fullName: string;
  documentType: ComplaintDocumentType;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  department: string;
  isMinor: boolean;
  guardianName?: string;
  itemType: ComplaintItemType;
  itemDescription: string;
  claimedAmount?: number;
  currency: 'PEN' | 'USD';
  claimType: ComplaintClaimType;
  detail: string;
  request: string;
}

export interface ComplaintReceipt {
  id: string;
  code: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly api = inject(ApiService);

  send(payload: ComplaintPayload): Observable<ComplaintReceipt> {
    return this.api.post<ComplaintReceipt>('/complaints', payload);
  }
}
