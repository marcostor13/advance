import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  AdminStats,
  INSTRUMENT_LABELS,
  LEAD_STATUSES,
  Lead,
  LeadStatus,
  Quote,
  Simulation,
} from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';

type ActiveTab = 'quotes' | 'simulations' | 'leads';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, IconComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly activeTab = signal<ActiveTab>('quotes');
  readonly stats = signal<AdminStats | null>(null);
  readonly quotes = signal<Quote[]>([]);
  readonly simulations = signal<Simulation[]>([]);
  readonly leads = signal<Lead[]>([]);
  readonly loading = signal(false);
  readonly statusFilter = signal<LeadStatus | ''>('');
  readonly expandedNoteId = signal<string | null>(null);
  readonly editingNote = signal<{ id: string; value: string } | null>(null);

  readonly leadStatuses = LEAD_STATUSES;
  readonly instrumentLabels = INSTRUMENT_LABELS;

  ngOnInit(): void {
    this.loadStats();
    this.loadTab('quotes');
  }

  loadStats(): void {
    this.admin.stats().subscribe({ next: (s) => this.stats.set(s) });
  }

  loadTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
    this.loading.set(true);
    switch (tab) {
      case 'quotes':
        this.admin.quotes(this.statusFilter()).subscribe({
          next: (data) => { this.quotes.set(data); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
        break;
      case 'simulations':
        this.admin.simulations(this.statusFilter()).subscribe({
          next: (data) => { this.simulations.set(data); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
        break;
      case 'leads':
        this.admin.leads().subscribe({
          next: (data) => { this.leads.set(data); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
        break;
    }
  }

  updateQuoteStatus(id: string, status: string): void {
    this.admin.updateQuote(id, { status: status as LeadStatus }).subscribe({
      next: () => this.loadTab('quotes'),
    });
  }

  updateSimStatus(id: string, status: string): void {
    this.admin.updateSimulation(id, { status: status as LeadStatus }).subscribe({
      next: () => this.loadTab('simulations'),
    });
  }

  toggleNote(id: string, currentNote: string): void {
    if (this.expandedNoteId() === id) {
      this.expandedNoteId.set(null);
      this.editingNote.set(null);
    } else {
      this.expandedNoteId.set(id);
      this.editingNote.set({ id, value: currentNote ?? '' });
    }
  }

  updateEditingNote(value: string): void {
    const current = this.editingNote();
    if (current) this.editingNote.set({ ...current, value });
  }

  saveNote(id: string, type: 'quote' | 'sim'): void {
    const note = this.editingNote();
    if (!note || note.id !== id) return;
    const onSuccess = () => {
      this.expandedNoteId.set(null);
      this.editingNote.set(null);
      this.loadTab(type === 'quote' ? 'quotes' : 'simulations');
    };
    if (type === 'quote') {
      this.admin.updateQuote(id, { notes: note.value }).subscribe({ next: onSuccess });
    } else {
      this.admin.updateSimulation(id, { notes: note.value }).subscribe({ next: onSuccess });
    }
  }

  filterChange(status: string): void {
    this.statusFilter.set(status as LeadStatus | '');
    this.loadTab(this.activeTab());
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  getUserName(user: Quote['user'] | Simulation['user']): string {
    return typeof user === 'object' ? user.name : '—';
  }

  getUserCompany(user: Quote['user'] | Simulation['user']): string {
    return typeof user === 'object' ? (user.company ?? '—') : '—';
  }

  format(value: number, currency: string): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }
}
