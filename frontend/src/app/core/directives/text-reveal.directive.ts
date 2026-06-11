import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

/**
 * Masked line reveal: wraps the host's content in an inner block that
 * slides up from below an overflow-hidden mask when scrolled into view.
 * Stagger multiple lines via `revealDelay`.
 */
@Directive({
  selector: '[appTextReveal]',
  standalone: true,
})
export class TextRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = '0ms';

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    const inner = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(inner, 'tr-inner');
    while (host.firstChild) {
      inner.appendChild(host.firstChild);
    }
    this.renderer.appendChild(host, inner);
    this.renderer.addClass(host, 'tr-mask');
    if (this.revealDelay !== '0ms') {
      host.style.setProperty('--tr-delay', this.revealDelay);
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(host, 'tr-active');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
