import { Component, computed, inject } from '@angular/core';
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

  // Routes that render their own full-screen shell (no marketing chrome).
  private readonly bareRoutes = ['/portal', '/admin'];

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly showChrome = computed(
    () => !this.bareRoutes.some((r) => this.currentUrl().startsWith(r)),
  );
}
