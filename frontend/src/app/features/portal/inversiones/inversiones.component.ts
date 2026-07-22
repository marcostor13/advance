import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INVESTMENTS } from '../portal.data';

@Component({
  selector: 'app-portal-inversiones',
  standalone: true,
  imports: [],
  templateUrl: './inversiones.component.html',
  styleUrl: './inversiones.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InversionesComponent {
  protected readonly investments = INVESTMENTS;
}
