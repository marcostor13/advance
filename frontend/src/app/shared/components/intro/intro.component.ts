import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

/**
 * One-time brand splash shown on full page load (not on SPA route changes,
 * since AppComponent survives navigation). Waits for real content readiness
 * (window load + web fonts) plus a minimum display time, then splits open
 * with a two-panel curtain reveal to hand off to the app underneath.
 */
@Component({
  selector: 'app-intro',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="intro" [class.intro--exit]="exiting()">
        <span class="intro__panel intro__panel--l" aria-hidden="true"></span>
        <span class="intro__panel intro__panel--r" aria-hidden="true"></span>

        <div class="intro__content">
          <div class="intro__mark">
            <span class="intro__glow" aria-hidden="true"></span>
            <span class="intro__ring" aria-hidden="true"></span>
            <img src="/5.png" alt="Advance Group" class="intro__logo" />
          </div>

          <span class="intro__progress" aria-hidden="true">
            <span class="intro__progress-fill"></span>
          </span>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .intro {
        position: fixed;
        inset: 0;
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: all;
      }

      /* ── Two navy panels form the backdrop and split apart on exit ── */
      .intro__panel {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50.5%;
        background: var(--deep-blue);
        transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1) 0.32s;
        will-change: transform;
      }
      .intro__panel--l {
        left: 0;
        background: linear-gradient(120deg, var(--deep-blue-2), var(--deep-blue));
      }
      .intro__panel--r {
        right: 0;
        background: linear-gradient(240deg, var(--deep-blue-2), var(--deep-blue));
      }
      .intro--exit .intro__panel--l {
        transform: translateX(-101%);
      }
      .intro--exit .intro__panel--r {
        transform: translateX(101%);
      }

      /* ── Centered brand content, above the panels ── */
      .intro__content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.6rem;
        transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.5, 0, 0.2, 1);
        will-change: opacity, transform;
      }
      .intro--exit .intro__content {
        opacity: 0;
        transform: scale(1.08);
      }

      .intro__mark {
        position: relative;
        display: grid;
        place-items: center;
        width: clamp(120px, 18vw, 168px);
        height: clamp(120px, 18vw, 168px);
      }

      .intro__glow {
        position: absolute;
        inset: -40%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(252, 208, 149, 0.2), transparent 68%);
        animation: introPulse 2.6s ease-in-out infinite;
      }

      /* Thin spinning arc — loader cue built from a masked conic gradient */
      .intro__ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: conic-gradient(
          from 0deg,
          transparent 0 62%,
          rgba(252, 208, 149, 0.85) 78%,
          rgba(255, 255, 255, 0.95) 88%,
          transparent 100%
        );
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
        mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
        opacity: 0;
        animation: introRingIn 0.6s ease forwards 0.35s, introSpin 1.5s linear infinite 0.35s;
      }

      .intro__logo {
        width: 56%;
        height: auto;
        opacity: 0;
        transform: scale(0.5) rotate(-10deg);
        filter: drop-shadow(0 10px 34px rgba(183, 0, 22, 0.45));
        animation: introLogoIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
      }

      /* ── Progress bar fills across the display window ── */
      .intro__progress {
        display: block;
        width: clamp(140px, 22vw, 190px);
        height: 2px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.14);
        overflow: hidden;
      }
      .intro__progress-fill {
        display: block;
        height: 100%;
        width: 0;
        border-radius: 2px;
        background: linear-gradient(90deg, var(--crimson), var(--beige));
        animation: introFill 2s cubic-bezier(0.62, 0, 0.2, 1) 0.35s forwards;
      }

      @keyframes introLogoIn {
        to {
          opacity: 1;
          transform: scale(1) rotate(0);
        }
      }
      @keyframes introRingIn {
        to {
          opacity: 1;
        }
      }
      @keyframes introSpin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes introFill {
        0% {
          width: 0;
        }
        100% {
          width: 100%;
        }
      }
      @keyframes introPulse {
        0%,
        100% {
          transform: scale(0.9);
          opacity: 0.65;
        }
        50% {
          transform: scale(1.06);
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .intro__glow,
        .intro__ring,
        .intro__progress-fill {
          animation: none;
        }
        .intro__logo {
          animation: none;
          opacity: 1;
          transform: none;
        }
        .intro__progress-fill {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroComponent implements OnInit {
  private static readonly MIN_DISPLAY_MS = 2400;
  private static readonly EXIT_MS = 1250;

  protected readonly visible = signal(true);
  protected readonly exiting = signal(false);

  ngOnInit(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.visible.set(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, IntroComponent.MIN_DISPLAY_MS),
    );
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const windowLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener('load', () => resolve(), { once: true }),
          );

    Promise.all([minDelay, fontsReady, windowLoaded]).then(() => this.exit());
  }

  private exit(): void {
    this.exiting.set(true);
    document.body.style.overflow = '';
    setTimeout(() => this.visible.set(false), IntroComponent.EXIT_MS);
  }
}
