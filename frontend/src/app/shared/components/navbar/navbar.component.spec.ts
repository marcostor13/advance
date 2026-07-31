import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;

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
