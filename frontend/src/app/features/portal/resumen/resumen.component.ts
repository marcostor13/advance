import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ALLOCATIONS, MOVEMENTS, RESUMEN_STATS } from '../portal.data';

@Component({
  selector: 'app-portal-resumen',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumenComponent {
  protected readonly stats = RESUMEN_STATS;
  protected readonly allocations = ALLOCATIONS;
  protected readonly recent = MOVEMENTS.slice(0, 4);
}
