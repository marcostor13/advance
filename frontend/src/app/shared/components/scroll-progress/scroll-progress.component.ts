import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  viewChild,
} from '@angular/core';

/** Thin crimson reading-progress bar fixed above the header. */
@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `<div #bar class="progress-bar"></div>`,
  styles: [
    `
      .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, var(--crimson), var(--beige-dark));
        transform-origin: left;
        transform: scaleX(0);
        z-index: 1001;
        pointer-events: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollProgressComponent implements AfterViewInit, OnDestroy {
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');

  private rafId = 0;
  private ticking = false;
  private onScroll = (): void => {};

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const el = this.bar().nativeElement;
    this.zone.runOutsideAngular(() => {
      const update = (): void => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        el.style.transform = `scaleX(${p.toFixed(4)})`;
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
