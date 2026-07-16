import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../../core/services/portal.service';
import { REPORT_TYPE_LABELS, Report, ReportType } from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-portal-reports',
  standalone: true,
  imports: [DatePipe, IconComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent implements OnInit {
  private readonly portal = inject(PortalService);

  protected readonly typeLabels = REPORT_TYPE_LABELS;
  protected readonly reports = signal<Report[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.portal.reports().subscribe({
      next: (data) => {
        this.reports.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  iconFor(type: ReportType): string {
    switch (type) {
      case 'annual': return 'award';
      case 'quarterly': return 'bar-chart';
      case 'statement': return 'shield';
      default: return 'file-text';
    }
  }
}
