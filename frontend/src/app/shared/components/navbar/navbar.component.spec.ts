import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;

  const scrollTo = (y: number): void => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    component.onScroll();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark scrolled state beyond 30px', () => {
    scrollTo(50);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.navbar') as HTMLElement;
    expect(header.classList).toContain('navbar--scrolled');
  });

  it('should hide on scroll down beyond 200px and reveal on scroll up', () => {
    scrollTo(100);
    scrollTo(300);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.navbar') as HTMLElement;
    expect(header.classList).toContain('navbar--hidden');

    scrollTo(250);
    fixture.detectChanges();
    expect(header.classList).not.toContain('navbar--hidden');
  });

  it('should not hide while the mobile menu is open', () => {
    component.toggleMenu();
    scrollTo(100);
    scrollTo(400);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.navbar') as HTMLElement;
    expect(header.classList).not.toContain('navbar--hidden');
  });

  it('should lock and unlock body scroll when toggling the menu', () => {
    component.toggleMenu();
    expect(document.body.style.overflow).toBe('hidden');

    component.closeMenu();
    expect(document.body.style.overflow).toBe('');
  });

  it('should render all nav links with index numbers', () => {
    const indexes = fixture.nativeElement.querySelectorAll('.navbar__link-index');
    expect(indexes.length).toBe(4);
    expect((indexes[0] as HTMLElement).textContent).toContain('01');
  });
});
