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
import { AuthService } from '../../../core/services/auth.service';

interface NavLink {
  label: string;
  path: string;
  logo?: string;
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
  private readonly auth = inject(AuthService);

  protected readonly links: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Factoring', path: '/factoring', logo: '/logo-factoring.png' },
    { label: 'Capital', path: '/capital', logo: '/logo-capital.png' },
  ];

  protected readonly portalLink = computed(() =>
    this.auth.isAuthenticated()
      ? { path: '/portal', label: 'Mi cuenta' }
      : { path: '/portal/acceso', label: 'Acceso clientes' },
  );

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

  protected readonly isTransparent = computed(
    () => !this.isMenuOpen() && this.transparentRoutes.includes(this.currentUrl()),
  );

  protected readonly isNavyBg = computed(
    () => !this.isMenuOpen() && this.currentUrl() === '/contacto',
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
