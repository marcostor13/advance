import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() animType: 'up' | 'left' | 'right' | 'scale' | 'fade' = 'up';
  @Input() animDelay = '0ms';

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const native = this.el.nativeElement;
    this.renderer.addClass(native, 'anim-ready');
    this.renderer.addClass(native, `anim-${this.animType}`);
    if (this.animDelay && this.animDelay !== '0ms') {
      this.renderer.setStyle(native, 'transition-delay', this.animDelay);
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(native, 'anim-active');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(native);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
