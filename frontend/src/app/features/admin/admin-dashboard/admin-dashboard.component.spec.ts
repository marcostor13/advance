import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';
import { AdminStats, Lead, Quote, Simulation } from '../../../core/models/api.models';

const MOCK_STATS: AdminStats = {
  totalQuotes: 10,
  totalSimulations: 5,
  totalLeads: 8,
  newQuotes: 3,
  newSimulations: 2,
};

describe('AdminDashboardComponent', () => {
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let component: AdminDashboardComponent;
  let adminSpy: jasmine.SpyObj<AdminService>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    adminSpy = jasmine.createSpyObj('AdminService', [
      'stats',
      'quotes',
      'simulations',
      'leads',
      'updateQuote',
      'updateSimulation',
    ]);
    authSpy = jasmine.createSpyObj('AuthService', ['logout']);

    adminSpy.stats.and.returnValue(of(MOCK_STATS));
    adminSpy.quotes.and.returnValue(of([]));
    adminSpy.simulations.and.returnValue(of([]));
    adminSpy.leads.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent, RouterTestingModule],
      providers: [
        { provide: AdminService, useValue: adminSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads stats and quotes on init', () => {
    expect(adminSpy.stats).toHaveBeenCalled();
    expect(adminSpy.quotes).toHaveBeenCalled();
    expect(component.stats()).toEqual(MOCK_STATS);
  });

  it('switches to simulations tab', () => {
    component.loadTab('simulations');
    expect(component.activeTab()).toBe('simulations');
    expect(adminSpy.simulations).toHaveBeenCalled();
  });

  it('format() returns Intl currency string', () => {
    const result = component.format(1000, 'USD');
    expect(result).toContain('1');
  });

  it('getUserName returns name when user is object', () => {
    const mockUser = { _id: '1', name: 'Ana', email: '', phone: '', role: 'client' as const, createdAt: '' };
    expect(component.getUserName(mockUser)).toBe('Ana');
  });

  it('getUserName returns dash when user is string', () => {
    expect(component.getUserName('someId')).toBe('—');
  });

  it('logout calls auth.logout', () => {
    component.logout();
    expect(authSpy.logout).toHaveBeenCalled();
  });

  it('filterChange updates statusFilter and reloads tab', () => {
    component.filterChange('nueva');
    expect(component.statusFilter()).toBe('nueva');
    expect(adminSpy.quotes).toHaveBeenCalledWith('nueva');
  });
});
