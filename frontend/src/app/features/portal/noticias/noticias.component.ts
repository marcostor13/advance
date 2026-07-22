import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { NEWS, NEWS_CATEGORIES, News } from '../portal.data';

@Component({
  selector: 'app-portal-noticias',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticiasComponent {
  protected readonly categories = NEWS_CATEGORIES;
  protected readonly featured = NEWS[0];
  private readonly rest = NEWS.slice(1);

  protected readonly activeCat = signal<string>('Todas');
  protected readonly selected = signal<News | null>(null);

  protected readonly filtered = computed(() => {
    const cat = this.activeCat();
    return cat === 'Todas' ? this.rest : this.rest.filter((n) => n.category === cat);
  });

  open(n: News): void {
    this.selected.set(n);
  }

  close(): void {
    this.selected.set(null);
  }
}
