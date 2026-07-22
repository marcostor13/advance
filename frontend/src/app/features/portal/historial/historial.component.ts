import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { MOVEMENTS } from '../portal.data';

@Component({
  selector: 'app-portal-historial',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistorialComponent {
  protected readonly movements = MOVEMENTS;
}
