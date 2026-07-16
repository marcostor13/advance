import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AuthService } from '../../core/services/auth.service';
import { PORTAL_NAV, PORTAL_USER } from './portal.data';

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './portal-layout.component.html',
  styleUrl: './portal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalLayoutComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = PORTAL_USER;
  protected readonly nav = PORTAL_NAV;
  protected readonly isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
    this.syncScroll();
  }

  closeMenu(): void {
    if (!this.isMenuOpen()) return;
    this.isMenuOpen.set(false);
    this.syncScroll();
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 900) {
      this.closeMenu();
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  private syncScroll(): void {
    document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
  }
}
