import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  AdminStats,
  CreateUserPayload,
  ImportSummary,
  INSTRUMENT_LABELS,
  LEAD_STATUSES,
  Lead,
  LeadStatus,
  Movement,
  MovementPayload,
  Product,
  ProductPayload,
  Quote,
  Simulation,
  User,
} from '../../../core/models/api.models';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { extractErrorMessage } from '../../../core/utils/http-error';

type ActiveTab = 'quotes' | 'simulations' | 'leads' | 'users' | 'products' | 'movements' | 'import';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, DecimalPipe, IconComponent, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

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

  // ---- Users ----
  readonly users = signal<User[]>([]);
  readonly userSearch = signal('');
  readonly showUserForm = signal(false);
  readonly editingUser = signal<User | null>(null);
  readonly userSaveError = signal('');
  readonly lastCreatedTempPassword = signal<{ email: string; tempPassword: string } | null>(null);

  readonly userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    role: ['client'],
    password: [''],
    documentType: [''],
    documentNumber: [''],
    address: [''],
    district: [''],
    city: [''],
    country: [''],
    bank: [''],
    accountNumber: [''],
    cci: [''],
    riskProfile: [''],
    birthDate: [''],
    occupation: [''],
  });

  // ---- Products ----
  readonly products = signal<Product[]>([]);
  readonly showProductForm = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly productSaveError = signal('');

  readonly productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['fondo', [Validators.required]],
    annualRate: [0, [Validators.required, Validators.min(0)]],
    termMonths: [12, [Validators.required, Validators.min(1)]],
    description: [''],
  });

  // ---- Movements ----
  readonly movementsList = signal<Movement[]>([]);
  readonly showMovementForm = signal(false);
  readonly movementSaveError = signal('');
  readonly movementUserFilter = signal('');
  readonly movementProductFilter = signal('');

  readonly movementForm = this.fb.group({
    user: ['', [Validators.required]],
    product: ['', [Validators.required]],
    type: ['SUSCRIPCIÓN', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: ['', [Validators.required]],
    notes: [''],
  });

  // ---- Import ----
  readonly importing = signal(false);
  readonly importSummary = signal<ImportSummary | null>(null);
  readonly downloadingTemplate = signal(false);
  private selectedFile: File | null = null;

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
      case 'users':
        this.loadUsers();
        break;
      case 'products':
        this.admin.products().subscribe({
          next: (data) => { this.products.set(data); this.loading.set(false); },
          error: () => this.loading.set(false),
        });
        break;
      case 'movements':
        this.loadMovements();
        if (this.users().length === 0) this.admin.users().subscribe({ next: (u) => this.users.set(u) });
        if (this.products().length === 0) this.admin.products().subscribe({ next: (p) => this.products.set(p) });
        break;
      case 'import':
        this.loading.set(false);
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

  // ==================== Users ====================

  private loadUsers(): void {
    this.admin.users(this.userSearch(), 'client').subscribe({
      next: (data) => { this.users.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  searchUsers(value: string): void {
    this.userSearch.set(value);
    this.loadUsers();
  }

  openCreateUser(): void {
    this.editingUser.set(null);
    this.userSaveError.set('');
    this.userForm.reset({ role: 'client' });
    this.showUserForm.set(true);
  }

  openEditUser(user: User): void {
    this.editingUser.set(user);
    this.userSaveError.set('');
    this.userForm.reset({
      name: user.name,
      lastName: user.lastName ?? '',
      email: user.email,
      phone: user.phone ?? '',
      company: user.company ?? '',
      role: user.role,
      password: '',
      documentType: user.documentType ?? '',
      documentNumber: user.documentNumber ?? '',
      address: user.address ?? '',
      district: user.district ?? '',
      city: user.city ?? '',
      country: user.country ?? '',
      bank: user.bank ?? '',
      accountNumber: user.accountNumber ?? '',
      cci: user.cci ?? '',
      riskProfile: user.riskProfile ?? '',
      birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
      occupation: user.occupation ?? '',
    });
    this.showUserForm.set(true);
  }

  closeUserForm(): void {
    this.showUserForm.set(false);
    this.editingUser.set(null);
  }

  submitUserForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.userSaveError.set('');
    const raw = this.userForm.getRawValue();
    const payload = this.cleanPayload(raw) as unknown as CreateUserPayload;

    const editing = this.editingUser();
    if (editing) {
      delete (payload as Partial<CreateUserPayload>).password;
      this.admin.updateUser(editing._id, payload).subscribe({
        next: () => { this.closeUserForm(); this.loadUsers(); },
        error: (err) => this.userSaveError.set(this.errorMessage(err)),
      });
    } else {
      this.admin.createUser(payload).subscribe({
        next: (created) => {
          this.closeUserForm();
          this.loadUsers();
          if (created.tempPassword) {
            this.lastCreatedTempPassword.set({ email: created.email, tempPassword: created.tempPassword });
          }
        },
        error: (err) => this.userSaveError.set(this.errorMessage(err)),
      });
    }
  }

  deleteUser(user: User): void {
    if (!confirm(`¿Eliminar a ${user.name}? Esta acción no se puede deshacer.`)) return;
    this.admin.deleteUser(user._id).subscribe({ next: () => this.loadUsers() });
  }

  // ==================== Products ====================

  openCreateProduct(): void {
    this.editingProduct.set(null);
    this.productSaveError.set('');
    this.productForm.reset({ type: 'fondo', annualRate: 0, termMonths: 12 });
    this.showProductForm.set(true);
  }

  openEditProduct(product: Product): void {
    this.editingProduct.set(product);
    this.productSaveError.set('');
    this.productForm.reset({
      name: product.name,
      type: product.type,
      annualRate: product.annualRate,
      termMonths: product.termMonths,
      description: product.description ?? '',
    });
    this.showProductForm.set(true);
  }

  closeProductForm(): void {
    this.showProductForm.set(false);
    this.editingProduct.set(null);
  }

  submitProductForm(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.productSaveError.set('');
    const payload = this.cleanPayload(this.productForm.getRawValue()) as unknown as ProductPayload;
    const editing = this.editingProduct();
    const req = editing
      ? this.admin.updateProduct(editing._id, payload)
      : this.admin.createProduct(payload);
    req.subscribe({
      next: () => {
        this.closeProductForm();
        this.loadTab('products');
      },
      error: (err) => this.productSaveError.set(this.errorMessage(err)),
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`¿Eliminar el producto "${product.name}"?`)) return;
    this.admin.deleteProduct(product._id).subscribe({ next: () => this.loadTab('products') });
  }

  // ==================== Movements ====================

  private loadMovements(): void {
    this.admin
      .movements({ user: this.movementUserFilter() || undefined, product: this.movementProductFilter() || undefined })
      .subscribe({
        next: (data) => { this.movementsList.set(data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }

  filterMovementsByUser(userId: string): void {
    this.movementUserFilter.set(userId);
    this.loadMovements();
  }

  filterMovementsByProduct(productId: string): void {
    this.movementProductFilter.set(productId);
    this.loadMovements();
  }

  openCreateMovement(): void {
    this.movementSaveError.set('');
    this.movementForm.reset({ type: 'SUSCRIPCIÓN', amount: 0 });
    this.showMovementForm.set(true);
  }

  closeMovementForm(): void {
    this.showMovementForm.set(false);
  }

  submitMovementForm(): void {
    if (this.movementForm.invalid) {
      this.movementForm.markAllAsTouched();
      return;
    }
    this.movementSaveError.set('');
    const payload = this.movementForm.getRawValue() as MovementPayload;
    this.admin.createMovement(payload).subscribe({
      next: () => {
        this.closeMovementForm();
        this.loadMovements();
      },
      error: (err) => this.movementSaveError.set(this.errorMessage(err)),
    });
  }

  deleteMovement(movement: Movement): void {
    if (!confirm('¿Eliminar este movimiento?')) return;
    this.admin.deleteMovement(movement._id).subscribe({ next: () => this.loadMovements() });
  }

  movementUserName(user: Movement['user']): string {
    return typeof user === 'object' ? `${user.name} ${user.lastName ?? ''}`.trim() : '—';
  }

  movementProductName(product: Movement['product']): string {
    return typeof product === 'object' ? product.name : '—';
  }

  // ==================== Import ====================

  downloadTemplate(): void {
    this.downloadingTemplate.set(true);
    this.admin.downloadTemplate().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla-advance.xlsx';
        a.click();
        URL.revokeObjectURL(url);
        this.downloadingTemplate.set(false);
      },
      error: () => this.downloadingTemplate.set(false),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  submitImport(): void {
    if (!this.selectedFile) return;
    this.importing.set(true);
    this.importSummary.set(null);
    this.admin.importFile(this.selectedFile).subscribe({
      next: (summary) => {
        this.importSummary.set(summary);
        this.importing.set(false);
      },
      error: () => this.importing.set(false),
    });
  }

  // ==================== Helpers ====================

  private cleanPayload(raw: Record<string, unknown>): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (value !== '' && value !== null && value !== undefined) cleaned[key] = value;
    }
    return cleaned;
  }

  private errorMessage(err: unknown): string {
    return extractErrorMessage(err, 'Ocurrió un error. Intenta nuevamente.');
  }
}
