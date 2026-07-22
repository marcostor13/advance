import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { PortalService } from '../../../core/services/portal.service';
import { Movement, MovementType, Product } from '../../../core/models/api.models';

interface MovementGroup {
  product: { _id: string; name: string; type: Product['type'] };
  movements: Movement[];
}

const POSITIVE_TYPES: MovementType[] = ['RENDIMIENTO', 'VENCIMIENTO'];
const ICONS: Record<MovementType, string> = {
  RENDIMIENTO: 'trending-up',
  SUSCRIPCIÓN: 'file-text',
  VENCIMIENTO: 'check-circle',
};
const TITLES: Record<MovementType, string> = {
  RENDIMIENTO: 'Rendimiento devengado',
  SUSCRIPCIÓN: 'Suscripción de capital',
  VENCIMIENTO: 'Vencimiento y liquidación de capital',
};

@Component({
  selector: 'app-portal-historial',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialComponent implements OnInit {
  private readonly portal = inject(PortalService);

  private readonly movements = signal<Movement[]>([]);
  protected readonly loading = signal(true);

  protected readonly groups = computed<MovementGroup[]>(() => {
    const byProduct = new Map<string, MovementGroup>();
    for (const m of this.movements()) {
      const product = typeof m.product === 'object' ? m.product : null;
      if (!product) continue;
      const existing = byProduct.get(product._id);
      if (existing) {
        existing.movements.push(m);
      } else {
        byProduct.set(product._id, { product, movements: [m] });
      }
    }
    return [...byProduct.values()].sort((a, b) => a.product.name.localeCompare(b.product.name));
  });

  ngOnInit(): void {
    this.portal.movements().subscribe({
      next: (data) => {
        this.movements.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isPositive(type: MovementType): boolean {
    return POSITIVE_TYPES.includes(type);
  }

  iconFor(type: MovementType): string {
    return ICONS[type];
  }

  titleFor(type: MovementType): string {
    return TITLES[type];
  }

  formatAmount(value: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(value),
    );
  }
}
