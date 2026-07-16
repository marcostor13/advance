import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the three primary nav links', () => {
    const links = fixture.nativeElement.querySelectorAll('.navbar__link:not(.navbar__link--portal)');
    expect(links.length).toBe(3);
  });

  it('should point the portal link to the client access page when unauthenticated', () => {
    expect(component['portalLink']().path).toBe('/portal/acceso');
    expect(component['portalLink']().label).toBe('Acceso clientes');
  });

  it('should lock and unlock body scroll when toggling the menu', () => {
    component.toggleMenu();
    expect(document.body.style.overflow).toBe('hidden');

    component.closeMenu();
    expect(document.body.style.overflow).toBe('');
  });
});
