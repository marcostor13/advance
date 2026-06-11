import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  /** Positive = element drifts down slower than scroll; negative = opposite drift. */
  @Input({ alias: 'appParallax' }) speed: number | '' = 0.12;

  private rafId = 0;
  private ticking = false;
  private onScroll = (): void => {};

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const factor = typeof this.speed === 'number' ? this.speed : 0.12;

    this.zone.runOutsideAngular(() => {
      const update = (): void => {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom > -100 && rect.top < vh + 100) {
          const center = rect.top + rect.height / 2 - vh / 2;
          this.el.nativeElement.style.transform = `translate3d(0, ${(center * factor).toFixed(1)}px, 0)`;
        }
        this.ticking = false;
      };
      this.onScroll = () => {
        if (!this.ticking) {
          this.ticking = true;
          this.rafId = requestAnimationFrame(update);
        }
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });
      update();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    cancelAnimationFrame(this.rafId);
  }
}
