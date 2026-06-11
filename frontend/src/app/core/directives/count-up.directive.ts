import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'appCountUp' }) target = 0;
  @Input() countSuffix = '';
  @Input() countPrefix = '';
  @Input() countDuration = 1800;

  private observer?: IntersectionObserver;
  private rafId = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.el.nativeElement.textContent = `${this.countPrefix}0${this.countSuffix}`;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.animate();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  private animate(): void {
    const start = performance.now();
    const tick = (now: number): void => {
      const progress = Math.min((now - start) / this.countDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(this.target * eased);
      this.el.nativeElement.textContent = `${this.countPrefix}${value}${this.countSuffix}`;
      if (progress < 1) {
        this.rafId = requestAnimationFrame(tick);
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.rafId);
  }
}
