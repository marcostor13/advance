import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  input,
  viewChild,
} from '@angular/core';

/**
 * Infinite marquee whose speed reacts to scroll velocity.
 * Elegant by default: thin band, hairline borders, uppercase micro-type.
 */
@Component({
  selector: 'app-marquee',
  standalone: true,
  template: `
    <div class="marquee" [class.marquee--dark]="dark()">
      <div #track class="marquee__track">
        <div class="marquee__group">
          @for (item of items(); track $index) {
            <span class="marquee__item">{{ item }}</span>
            <span class="marquee__sep" aria-hidden="true"></span>
          }
        </div>
        <div class="marquee__group" aria-hidden="true">
          @for (item of items(); track $index) {
            <span class="marquee__item">{{ item }}</span>
            <span class="marquee__sep" aria-hidden="true"></span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .marquee {
        overflow: hidden;
        border-top: 1px solid var(--hairline);
        border-bottom: 1px solid var(--hairline);
        background: var(--white);
        padding-block: 1.375rem;
      }
      .marquee--dark {
        background: var(--deep-blue);
        border-color: var(--hairline-light);
      }
      .marquee__track {
        display: flex;
        width: max-content;
        will-change: transform;
      }
      .marquee__group {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      .marquee__item {
        font-family: var(--font-display);
        font-size: 0.8125rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: rgba(0, 29, 58, 0.5);
        white-space: nowrap;
      }
      .marquee--dark .marquee__item {
        color: rgba(255, 255, 255, 0.45);
      }
      .marquee__sep {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--beige-dark);
        margin-inline: 2.25rem;
        flex-shrink: 0;
        opacity: 0.7;
      }
      @media (prefers-reduced-motion: reduce) {
        .marquee__track {
          transform: none !important;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeComponent implements AfterViewInit, OnDestroy {
  readonly items = input.required<string[]>();
  readonly dark = input(false);
  readonly baseSpeed = input(0.5);

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  private rafId = 0;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = this.track().nativeElement;
    let x = 0;
    let lastScrollY = window.scrollY;

    this.zone.runOutsideAngular(() => {
      const tick = (): void => {
        const group = el.firstElementChild as HTMLElement | null;
        const width = group?.offsetWidth ?? 0;
        const velocity = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;

        const boost = Math.max(-6, Math.min(6, velocity * 0.35));
        x -= this.baseSpeed() + boost;

        if (width > 0) {
          if (x <= -width) x += width;
          if (x > 0) x -= width;
        }
        el.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }
}
