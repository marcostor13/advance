import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NewsService } from '../../../core/services/news.service';
import { NEWS_CATEGORY_LABELS, NewsArticle, NewsCategory } from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

type CategoryFilter = NewsCategory | 'all';

@Component({
  selector: 'app-portal-news',
  standalone: true,
  imports: [DatePipe, IconComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit {
  private readonly news = inject(NewsService);

  protected readonly categoryLabels = NEWS_CATEGORY_LABELS;
  protected readonly categories: CategoryFilter[] = ['all', 'empresa', 'mercado', 'producto', 'educacion'];

  protected readonly articles = signal<NewsArticle[]>([]);
  protected readonly loading = signal(true);
  protected readonly activeCategory = signal<CategoryFilter>('all');
  protected readonly selected = signal<NewsArticle | null>(null);

  protected readonly featured = computed(() => this.articles().find((a) => a.featured) ?? null);

  protected readonly grid = computed(() => {
    const cat = this.activeCategory();
    const feat = this.featured();
    return this.articles()
      .filter((a) => a !== feat)
      .filter((a) => cat === 'all' || a.category === cat);
  });

  ngOnInit(): void {
    this.news.list().subscribe({
      next: (data) => {
        this.articles.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setCategory(c: CategoryFilter): void {
    this.activeCategory.set(c);
  }

  open(article: NewsArticle): void {
    this.selected.set(article);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.selected.set(null);
    document.body.style.overflow = '';
  }
}
