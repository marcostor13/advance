import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { REPORTS } from '../portal.data';

@Component({
  selector: 'app-portal-reportes',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportesComponent {
  protected readonly reports = REPORTS;
}
