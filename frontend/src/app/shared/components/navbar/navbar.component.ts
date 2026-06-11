import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MagneticDirective } from '../../../core/directives/magnetic.directive';

interface NavLink {
  label: string;
  path: string;
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
  protected readonly links: NavLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Factoring', path: '/factoring' },
    { label: 'Capital', path: '/capital' },
    { label: 'Contacto', path: '/contacto' },
  ];

  protected readonly isScrolled = signal(false);
  protected readonly isMenuOpen = signal(false);
  protected readonly isHidden = signal(false);

  private lastScrollY = 0;

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    this.isScrolled.set(y > 30);
    // Never hide while the mobile menu overlays the page
    if (!this.isMenuOpen()) {
      this.isHidden.set(y > 200 && y > this.lastScrollY);
    }
    this.lastScrollY = y;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    // Leaving the mobile breakpoint with the menu open would keep body scroll locked
    if (window.innerWidth > 768) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
    this.syncMenuState();
  }

  closeMenu(): void {
    if (!this.isMenuOpen()) {
      return;
    }
    this.isMenuOpen.set(false);
    this.syncMenuState();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  private syncMenuState(): void {
    if (this.isMenuOpen()) {
      this.isHidden.set(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
