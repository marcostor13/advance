import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { MagneticDirective } from '../../../core/directives/magnetic.directive';

interface NavLink {
  label: string;
  path: string;
  logo?: string;
  /** Compensates logomarks whose artwork has more internal padding, so all logos read as the same visual size. */
  logoBoost?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MagneticDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnDestroy {
  private readonly router = inject(Router);

  protected readonly links: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Factoring', path: '/factoring', logo: '/logo-factoring.png' },
    { label: 'Capital', path: '/capital', logo: '/logo-capital.png', logoBoost: true },
  ];

  protected readonly isMenuOpen = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  private readonly transparentRoutes = ['/', '/factoring', '/capital'];
  private readonly navyRoutes = ['/contacto'];

  protected readonly isTransparent = computed(
    () => !this.isMenuOpen() && this.transparentRoutes.includes(this.currentUrl()),
  );

  protected readonly isNavyBg = computed(
    () => !this.isMenuOpen() && this.navyRoutes.includes(this.currentUrl()),
  );

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
    this.syncMenuState();
  }

  closeMenu(): void {
    if (!this.isMenuOpen()) return;
    this.isMenuOpen.set(false);
    this.syncMenuState();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  private syncMenuState(): void {
    if (this.isMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
