import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  /** Navigates and flushes the resulting template update. */
  async function goTo(url: string): Promise<void> {
    await router.navigateByUrl(url);
    fixture.detectChanges();
  }

  const el = (selector: string): HTMLElement | null =>
    fixture.nativeElement.querySelector(selector);

  const all = (selector: string): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll(selector));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should lock and unlock body scroll when toggling the menu', () => {
    component.toggleMenu();
    expect(document.body.style.overflow).toBe('hidden');

    component.closeMenu();
    expect(document.body.style.overflow).toBe('');
  });

  it('should number only the links that have no logo', async () => {
    await goTo('/');
    const indexes = all('.navbar__link-index');
    expect(indexes.length).toBe(1);
    expect(indexes[0].textContent).toContain('01');
  });

  describe('brand isolation (TCK-8015)', () => {
    it('shows the Group logo and both unit logos outside a unit page', async () => {
      await goTo('/');
      expect((el('.navbar__logo-img') as HTMLImageElement | null)?.src).toContain(
        'logo-advance.png',
      );
      expect(all('.navbar__link-logo').length).toBe(2);
    });

    it('shows the Capital logo in the header and hides the nav pills on Advance Capital', async () => {
      await goTo('/capital');
      expect((el('.navbar__logo-img') as HTMLImageElement | null)?.src).toContain(
        'logo-capital.png',
      );
      expect(all('.navbar__link-logo').length).toBe(0);
    });

    it('shows the Factoring logo in the header and hides the nav pills on Advance Factoring', async () => {
      await goTo('/factoring');
      expect((el('.navbar__logo-img') as HTMLImageElement | null)?.src).toContain(
        'logo-factoring.png',
      );
      expect(all('.navbar__link-logo').length).toBe(0);
    });

    it('treats subroutes of a unit as part of that unit', async () => {
      await goTo('/capital/simulador');
      expect((el('.navbar__logo-img') as HTMLImageElement | null)?.src).toContain(
        'logo-capital.png',
      );
    });

    it('does not treat a route that merely starts with the same text as a unit', async () => {
      await goTo('/capitalizacion');
      expect((el('.navbar__logo-img') as HTMLImageElement | null)?.src).toContain(
        'logo-advance.png',
      );
    });
  });

  describe('client login (TCK-8014)', () => {
    it('is hidden outside Advance Capital', async () => {
      await goTo('/');
      expect(el('.navbar__login')).toBeNull();
      expect(el('.navbar__login-mobile')).toBeNull();
    });

    it('is hidden on Advance Factoring', async () => {
      await goTo('/factoring');
      expect(el('.navbar__login')).toBeNull();
    });

    it('reads "Iniciar sesión clientes" on Advance Capital', async () => {
      await goTo('/capital');
      expect(el('.navbar__login')?.textContent?.trim()).toBe('Iniciar sesión clientes');
      expect(el('.navbar__login-mobile')?.textContent?.trim()).toBe('Iniciar sesión clientes');
    });
  });
});
