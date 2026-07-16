import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NewsArticle } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly api = inject(ApiService);

  list(): Observable<NewsArticle[]> {
    return this.api.get<NewsArticle[]>('/news');
  }

  detail(id: string): Observable<NewsArticle> {
    return this.api.get<NewsArticle>(`/news/${id}`);
  }
}
