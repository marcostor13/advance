import { Component, computed, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CursorComponent } from './shared/components/cursor/cursor.component';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';
import { AiChatComponent } from './shared/components/ai-chat/ai-chat.component';
import { IntroComponent } from './shared/components/intro/intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CursorComponent,
    ScrollProgressComponent,
    AiChatComponent,
    IntroComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  // Full-screen views (own layout, own header) — hide marketing navbar/footer/etc.
  protected readonly isBare = computed(
    () => this.currentUrl().startsWith('/portal') || this.currentUrl().startsWith('/admin'),
  );

  // Only /portal swaps the custom animated cursor for the native system one.
  protected readonly useNativeCursor = computed(() => this.currentUrl().startsWith('/portal'));

  constructor() {
    effect(() => {
      document.body.classList.toggle('portal-route', this.useNativeCursor());
    });
  }
}
