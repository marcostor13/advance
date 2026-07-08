import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

/**
 * One-time brand splash shown on full page load (not on SPA route changes,
 * since AppComponent survives navigation). Waits for real content readiness
 * (window load + web fonts) plus a minimum display time, then curtain-fades
 * to reveal the app underneath.
 */
@Component({
  selector: 'app-intro',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="intro" [class.intro--exit]="exiting()">
        <div class="intro__glow" aria-hidden="true"></div>
        <div class="intro__mark">
          <img src="/5.png" alt="Advance Group" class="intro__logo" />
          <span class="intro__bar" aria-hidden="true"></span>
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
        background: var(--deep-blue);
        transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
        will-change: opacity, transform;

        &--exit {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }
      }

      .intro__glow {
        position: absolute;
        width: min(60vw, 480px);
        height: min(60vw, 480px);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(252, 208, 149, 0.16), transparent 70%);
        animation: introPulse 2.4s ease-in-out infinite;
      }

      .intro__mark {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.1rem;
      }

      .intro__logo {
        width: clamp(64px, 10vw, 96px);
        height: auto;
        opacity: 0;
        transform: scale(0.68) rotate(-6deg);
        filter: drop-shadow(0 8px 28px rgba(183, 0, 22, 0.35));
        animation: introLogoIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
      }

      .intro__bar {
        display: block;
        width: 0;
        height: 2px;
        background: var(--beige);
        animation: introBarIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.75s forwards;
      }

      @keyframes introLogoIn {
        to {
          opacity: 1;
          transform: scale(1) rotate(0);
        }
      }

      @keyframes introBarIn {
        to {
          width: 56px;
        }
      }

      @keyframes introPulse {
        0%,
        100% {
          transform: scale(0.92);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.05);
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .intro__glow {
          animation: none;
        }
        .intro__logo,
        .intro__bar {
          animation: none;
          opacity: 1;
          transform: none;
          width: 56px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroComponent implements OnInit {
  protected readonly visible = signal(true);
  protected readonly exiting = signal(false);

  ngOnInit(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.visible.set(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 900));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const windowLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));

    Promise.all([minDelay, fontsReady, windowLoaded]).then(() => this.exit());
  }

  private exit(): void {
    this.exiting.set(true);
    document.body.style.overflow = '';
    setTimeout(() => this.visible.set(false), 700);
  }
}
