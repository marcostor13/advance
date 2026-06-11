import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  viewChild,
} from '@angular/core';

/** Custom cursor: crimson dot + blend-difference ring that expands over interactives. */
@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    <div #dot class="cursor-dot"></div>
    <div #ring class="cursor-ring"></div>
  `,
  styles: [
    `
      :host {
        display: none;
      }
      @media (hover: hover) and (pointer: fine) {
        :host {
          display: block;
        }
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--crimson);
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
        }
        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #fff;
          mix-blend-mode: difference;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
        }
        .cursor-ring.is-active {
          width: 60px;
          height: 60px;
        }
        .cursor-ring.is-down {
          width: 26px;
          height: 26px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');

  private rafId = 0;
  private cleanup: Array<() => void> = [];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dotEl = this.dot().nativeElement;
    const ringEl = this.ring().nativeElement;
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;

    this.zone.runOutsideAngular(() => {
      const onMove = (e: MouseEvent): void => {
        mx = e.clientX;
        my = e.clientY;
        dotEl.style.left = `${mx}px`;
        dotEl.style.top = `${my}px`;
      };
      const onOver = (e: Event): void => {
        const t = e.target as HTMLElement;
        if (t.closest('a, button, [data-cursor]')) ringEl.classList.add('is-active');
      };
      const onOut = (e: Event): void => {
        const t = e.target as HTMLElement;
        if (t.closest('a, button, [data-cursor]')) ringEl.classList.remove('is-active');
      };
      const onDown = (): void => ringEl.classList.add('is-down');
      const onUp = (): void => ringEl.classList.remove('is-down');

      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseover', onOver, { passive: true });
      document.addEventListener('mouseout', onOut, { passive: true });
      document.addEventListener('mousedown', onDown, { passive: true });
      document.addEventListener('mouseup', onUp, { passive: true });
      this.cleanup.push(
        () => document.removeEventListener('mousemove', onMove),
        () => document.removeEventListener('mouseover', onOver),
        () => document.removeEventListener('mouseout', onOut),
        () => document.removeEventListener('mousedown', onDown),
        () => document.removeEventListener('mouseup', onUp)
      );

      const tick = (): void => {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        ringEl.style.left = `${rx.toFixed(1)}px`;
        ringEl.style.top = `${ry.toFixed(1)}px`;
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.cleanup.forEach((fn) => fn());
  }
}
