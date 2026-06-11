import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 masked hero lines with outline accent on "crecimiento"', () => {
    const lines = fixture.nativeElement.querySelectorAll('.hero__line.tr-mask');
    const accent = fixture.nativeElement.querySelector('.hero__title .outline-text');
    expect(lines.length).toBe(3);
    expect(accent?.textContent).toContain('crecimiento');
  });

  it('should render marquee with the 6 sectors duplicated for the infinite loop', () => {
    const items = fixture.nativeElement.querySelectorAll('app-marquee .marquee__item');
    expect(items.length).toBe(component.sectors.length * 2);
  });

  it('should render 2 company cards with index and micro-labels', () => {
    const cards = fixture.nativeElement.querySelectorAll('.company-card');
    const indexes = fixture.nativeElement.querySelectorAll('.company-card__index');
    const labels = fixture.nativeElement.querySelectorAll('.company-card__label');
    expect(cards.length).toBe(2);
    expect(indexes[0]?.textContent).toContain('01');
    expect(indexes[1]?.textContent).toContain('02');
    expect(labels[0]?.textContent).toContain('Liquidez');
    expect(labels[1]?.textContent).toContain('Inversiones');
  });

  it('should render 4 stat counters', () => {
    const stats = fixture.nativeElement.querySelectorAll('.stat-item');
    expect(stats.length).toBe(4);
  });

  it('should render 3 deck cards with icons and a dark middle card', () => {
    const cards = fixture.nativeElement.querySelectorAll('.deck__card');
    const icons = fixture.nativeElement.querySelectorAll('.deck__icon app-icon');
    expect(cards.length).toBe(3);
    expect(icons.length).toBe(3);
    expect(cards[1]?.classList.contains('deck__card--dark')).toBeTrue();
  });

  it('should have links to /factoring and /capital', () => {
    expect(fixture.nativeElement.querySelector('a[href="/factoring"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[href="/capital"]')).toBeTruthy();
  });

  it('should have WhatsApp link in CTA', () => {
    const link = fixture.nativeElement.querySelector('a[href="https://wa.me/51932499073"]');
    expect(link).toBeTruthy();
  });
});
