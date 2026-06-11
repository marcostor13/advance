import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FactoringComponent } from './factoring.component';

describe('FactoringComponent', () => {
  let fixture: ComponentFixture<FactoringComponent>;
  let component: FactoringComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoringComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FactoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose 2 services, 4 differentiators, 3 team members, 6 sectors, 3 offices', () => {
    expect(component.services.length).toBe(2);
    expect(component.differentiators.length).toBe(4);
    expect(component.team.length).toBe(3);
    expect(component.sectors.length).toBe(6);
    expect(component.offices.length).toBe(3);
  });

  it('should expose 4 counters', () => {
    expect(component.counters.length).toBe(4);
    expect(component.counters[0]).toEqual({ value: 20, suffix: '+', label: 'Años de experiencia' });
  });

  it('should provide mini features for every service', () => {
    for (const service of component.services) {
      expect(component.serviceMiniFeatures[service.id]?.length).toBe(3);
    }
  });

  it('should use icon names instead of emojis for services and sectors', () => {
    expect(component.services.map((s) => s.icon)).toEqual(['file-text', 'check-circle']);
    expect(component.sectors[0].icon).toBe('mountain');
  });

  it('should render one service index row per service linking to contact', () => {
    const el: HTMLElement = fixture.nativeElement;
    const rows = el.querySelectorAll<HTMLAnchorElement>('a.service-row');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.service-row__title')?.textContent).toContain('Factoring');
    expect(rows[1].querySelector('.service-row__title')?.textContent).toContain('Confirming');
    expect(rows[0].getAttribute('href')).toContain('/contacto');
    expect(rows[0].querySelector('.service-row__benefits')?.textContent).toContain(' · ');
  });

  it('should render hero badges and CTA links', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.af-hero__badges')?.textContent).toContain('SBS N° 00029814');
    expect(el.querySelector('.af-hero__badges')?.textContent).toContain('CAVALI · Matriz 937');
    const whatsapp = el.querySelector<HTMLAnchorElement>('.af-hero__actions a[href*="wa.me/51932499073"]');
    expect(whatsapp).toBeTruthy();
  });

  it('should keep the 3 regulatory hero facts and render the title reveal lines', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(component.heroFacts.length).toBe(3);
    expect(component.heroFacts[0]).toContain('SBS');
    const lines = el.querySelectorAll('.af-hero__line');
    expect(lines.length).toBe(3);
    expect(el.querySelector('.af-hero__title')?.textContent).toContain('liquidez');
  });

  it('should render 6 sector cards, 3 team cards and 4 sticky deck cards', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.sector-card').length).toBe(6);
    expect(el.querySelectorAll('.team-card').length).toBe(3);
    expect(el.querySelectorAll('.diff-deck__card').length).toBe(4);
  });

  it('should render team specialties as a plain separated row', () => {
    const el: HTMLElement = fixture.nativeElement;
    const specialties = el.querySelector('.team-card__specialties');
    expect(specialties?.textContent).toContain('Factoring · Leasing');
  });

  it('should mark Lima as the main office', () => {
    const el: HTMLElement = fixture.nativeElement;
    const main = el.querySelector('.office-card--main');
    expect(main?.textContent).toContain('Lima');
    expect(main?.querySelector('.office-card__main-tag')?.textContent).toContain('Principal');
  });

  it('should render the final CTA contacts and actions', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.af-cta__title')?.textContent).toContain('Convierta sus facturas en liquidez');
    expect(el.querySelector<HTMLAnchorElement>('a.af-cta__title')?.href).toContain('mailto:contacto@advance-factoring.com');
    expect(el.querySelector('.af-cta__contacts')?.textContent).toContain('+51 952 493 810');
    const mail = el.querySelector<HTMLAnchorElement>('.af-cta__actions a[href^="mailto:"]');
    const wa = el.querySelector<HTMLAnchorElement>('.af-cta__actions a[href*="wa.me/51952493810"]');
    expect(mail).toBeTruthy();
    expect(wa).toBeTruthy();
  });
});
