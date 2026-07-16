import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

interface PortalNavLink {
  label: string;
  path: string;
  icon: string;
  exact: boolean;
}

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './portal-layout.component.html',
  styleUrl: './portal-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly sidebarOpen = signal(false);

  protected readonly initials = computed(() => {
    const name = this.user()?.name ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  });

  protected readonly links: PortalNavLink[] = [
    { label: 'Resumen', path: '/portal', icon: 'bar-chart', exact: true },
    { label: 'Mis Inversiones', path: '/portal/inversiones', icon: 'trending-up', exact: false },
    { label: 'Historial', path: '/portal/historial', icon: 'refresh-cw', exact: false },
    { label: 'Reportes', path: '/portal/reportes', icon: 'file-text', exact: false },
    { label: 'Noticias', path: '/portal/noticias', icon: 'globe', exact: false },
  ];

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 960) this.sidebarOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/portal/acceso']);
  }
}
