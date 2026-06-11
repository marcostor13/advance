import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <div class="not-found__inner">
        <span class="not-found__code" aria-hidden="true">404</span>
        <h1 class="not-found__title">Página no encontrada</h1>
        <p class="not-found__message">
          La página que buscas no existe o fue movida.
        </p>
        <a routerLink="/" class="btn btn--primary">Volver al inicio</a>
      </div>
    </section>
  `,
  styles: [`
    .not-found {
      min-height: calc(100vh - var(--header-height));
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--spacing-xl);

      &__inner { max-width: 480px; }

      &__code {
        display: block;
        font-size: 8rem;
        font-weight: 900;
        color: var(--color-accent);
        line-height: 1;
        opacity: 0.15;
        letter-spacing: -0.05em;
      }

      &__title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--spacing-md);
        margin-top: calc(var(--spacing-xl) * -2);
      }

      &__message {
        color: var(--color-text-light);
        margin-bottom: var(--spacing-xl);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
