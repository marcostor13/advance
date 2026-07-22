import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface ApiWrapped<T> {
  data: T;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<ApiWrapped<T>>(path).pipe(map((r) => r.data));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<ApiWrapped<T>>(path, body).pipe(map((r) => r.data));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<ApiWrapped<T>>(path, body).pipe(map((r) => r.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiWrapped<T>>(path).pipe(map((r) => r.data));
  }

  postForm<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<ApiWrapped<T>>(path, formData).pipe(map((r) => r.data));
  }

  getBlob(path: string): Observable<Blob> {
    return this.http.get(path, { responseType: 'blob' });
  }
}
