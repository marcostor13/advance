import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the giant CTA linking to /contacto', () => {
    const giant = fixture.nativeElement.querySelector('.footer__giant') as HTMLAnchorElement;
    expect(giant).toBeTruthy();
    expect(giant.textContent).toContain('Hablemos');
    expect(giant.getAttribute('href')).toBe('/contacto');
  });

  it('should render the watermark hidden from assistive tech', () => {
    const watermark = fixture.nativeElement.querySelector('.footer__watermark') as HTMLElement;
    expect(watermark.textContent).toContain('Advance Group');
    expect(watermark.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render the four social links', () => {
    const links = fixture.nativeElement.querySelectorAll('.footer__social-link');
    expect(links.length).toBe(4);
  });

  it('should show the current year in the bottom bar', () => {
    const bottom = fixture.nativeElement.querySelector('.footer__bottom-inner p') as HTMLElement;
    expect(bottom.textContent).toContain(String(new Date().getFullYear()));
  });
});
