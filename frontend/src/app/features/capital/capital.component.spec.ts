import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CapitalComponent } from './capital.component';

describe('CapitalComponent', () => {
  let component: CapitalComponent;
  let fixture: ComponentFixture<CapitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapitalComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose 3 products', () => {
    expect(component.products.length).toBe(3);
  });

  it('should expose 4 stats', () => {
    expect(component.stats.length).toBe(4);
  });

  it('should expose 6 benefits grouped in 3 pairs', () => {
    expect(component.benefits.length).toBe(6);
    expect(component.benefitPairs.length).toBe(3);
    component.benefitPairs.forEach(pair => expect(pair.length).toBe(2));
  });

  it('should expose 4 process steps', () => {
    expect(component.steps.length).toBe(4);
  });

  it('should expose 5 marquee items', () => {
    expect(component.marqueeItems.length).toBe(5);
    expect(component.marqueeItems).toContain('Respaldo Advance Factoring');
  });

  it('should have product ids: factoring, leasing, capital-estructurado', () => {
    const ids = component.products.map(p => p.id);
    expect(ids).toEqual(['factoring', 'leasing', 'capital-estructurado']);
  });

  it('should assign icon names to products', () => {
    const icons = component.products.map(p => p.icon);
    expect(icons).toEqual(['trending-up', 'building', 'layers']);
  });

  it('should assign icon names to benefits', () => {
    const icons = component.benefits.map(b => b.icon);
    expect(icons).toEqual(['award', 'bar-chart', 'shield', 'users', 'clock', 'globe']);
  });

  it('should render hero title with 3 reveal lines containing "capital"', () => {
    const title = fixture.nativeElement.querySelector('.ac-hero__title');
    const lines = fixture.nativeElement.querySelectorAll('.ac-hero__line');
    expect(title).toBeTruthy();
    expect(lines.length).toBe(3);
    expect(title.textContent).toContain('capital');
  });

  it('should render outline accent on "capital" in hero', () => {
    const accent = fixture.nativeElement.querySelector('.ac-hero__line .outline-text');
    expect(accent).toBeTruthy();
    expect(accent.textContent?.trim()).toBe('capital');
  });

  it('should render 3 hero mini-stats with counters', () => {
    const stats = fixture.nativeElement.querySelectorAll('.ac-hero__stat');
    const counters = fixture.nativeElement.querySelectorAll('.ac-hero__stat-value span[countsuffix], .ac-hero__stat-value span');
    expect(stats.length).toBe(3);
    expect(counters.length).toBeGreaterThanOrEqual(2);
  });

  it('should render hero scroll indicator', () => {
    expect(fixture.nativeElement.querySelector('.ac-hero__scroll')).toBeTruthy();
  });

  it('should render dark marquee under the hero', () => {
    const marquee = fixture.nativeElement.querySelector('app-marquee .marquee--dark');
    expect(marquee).toBeTruthy();
  });

  it('should render 3 product index rows linking to contact', () => {
    const rows = fixture.nativeElement.querySelectorAll('.ac-products__row');
    expect(rows.length).toBe(3);
    rows.forEach((row: HTMLAnchorElement) => {
      expect(row.getAttribute('href')).toContain('/contacto');
    });
  });

  it('should render product row indices 01 to 03', () => {
    const indices = Array.from(
      fixture.nativeElement.querySelectorAll('.ac-products__index')
    ).map(el => (el as HTMLElement).textContent?.trim());
    expect(indices).toEqual(['01', '02', '03']);
  });

  it('should render an icon and arrow per product row', () => {
    const icons = fixture.nativeElement.querySelectorAll('.ac-products__icon app-icon svg');
    const arrows = fixture.nativeElement.querySelectorAll('.ac-products__arrow app-icon svg');
    expect(icons.length).toBe(3);
    expect(arrows.length).toBe(3);
  });

  it('should render highlights joined with separators', () => {
    const highlights = fixture.nativeElement.querySelector('.ac-products__highlights');
    expect(highlights.textContent).toContain(' · ');
  });

  it('should render group diagram with highlighted Capital chip', () => {
    const chips = fixture.nativeElement.querySelectorAll('.ac-about__chip');
    const highlight = fixture.nativeElement.querySelector('.ac-about__chip--highlight');
    expect(chips.length).toBe(3);
    expect(highlight).toBeTruthy();
  });

  it('should render 4 mini-stats in about section', () => {
    const miniStats = fixture.nativeElement.querySelectorAll('.ac-about__mini-stat');
    expect(miniStats.length).toBe(4);
  });

  it('should render SBS stat as plain text (no counter)', () => {
    const values = Array.from(
      fixture.nativeElement.querySelectorAll('.ac-about__mini-stat-value')
    ) as HTMLElement[];
    expect(values[3].textContent?.trim()).toBe('SBS');
  });

  it('should render 3 deck cards with 6 benefit items', () => {
    const cards = fixture.nativeElement.querySelectorAll('.ac-benefits__card');
    const items = fixture.nativeElement.querySelectorAll('.ac-benefits__item');
    const icons = fixture.nativeElement.querySelectorAll('.ac-benefits__icon app-icon svg');
    expect(cards.length).toBe(3);
    expect(items.length).toBe(6);
    expect(icons.length).toBe(6);
  });

  it('should render the middle deck card as navy', () => {
    const cards = fixture.nativeElement.querySelectorAll('.ac-benefits__card');
    expect(cards[0].classList.contains('ac-benefits__card--navy')).toBeFalse();
    expect(cards[1].classList.contains('ac-benefits__card--navy')).toBeTrue();
    expect(cards[2].classList.contains('ac-benefits__card--navy')).toBeFalse();
  });

  it('should render 4 process steps with numbers 01 to 04', () => {
    const numbers = Array.from(
      fixture.nativeElement.querySelectorAll('.ac-process__number')
    ).map(el => (el as HTMLElement).textContent?.trim());
    expect(numbers).toEqual(['01', '02', '03', '04']);
  });

  it('should render process timeline line', () => {
    expect(fixture.nativeElement.querySelector('.ac-process__line')).toBeTruthy();
  });

  it('should render giant CTA link to contact with text reveal', () => {
    const link = fixture.nativeElement.querySelector('.ac-cta__link') as HTMLAnchorElement;
    const title = fixture.nativeElement.querySelector('.ac-cta__title');
    expect(link.getAttribute('href')).toContain('/contacto');
    expect(title.textContent).toContain('¿Listo para invertir con expertos?');
  });

  it('should render CTA actions with contact and WhatsApp links', () => {
    const ctaLinks = fixture.nativeElement.querySelectorAll('.ac-cta__actions a');
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2);
    const whatsapp = fixture.nativeElement.querySelector('.ac-cta__actions a[href*="wa.me/51932499073"]');
    expect(whatsapp).toBeTruthy();
  });

  it('should render schedule note', () => {
    const note = fixture.nativeElement.querySelector('.ac-cta__note');
    expect(note.textContent).toContain('Lun–Vie');
  });
});
