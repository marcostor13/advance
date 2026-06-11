import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Advance Group — Grupo Financiero Peruano',
  },
  {
    path: 'factoring',
    loadComponent: () =>
      import('./features/factoring/factoring.component').then((m) => m.FactoringComponent),
    title: 'Advance Factoring — Liquidez Empresarial',
  },
  {
    path: 'capital',
    loadComponent: () =>
      import('./features/capital/capital.component').then((m) => m.CapitalComponent),
    title: 'Advance Capital — Inversiones Estructuradas',
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contacto — Advance Group',
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/admin-login/admin-login.component').then((m) => m.AdminLoginComponent),
    title: 'Admin — Advance Group',
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    canActivate: [adminGuard],
    title: 'Panel de Administración — Advance Group',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 — Advance Group',
  },
];
