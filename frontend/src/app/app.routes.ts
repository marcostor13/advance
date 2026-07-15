import { Routes } from '@angular/router';
import { adminGuard, clientGuard } from './core/guards/auth.guard';

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
    path: 'portal/acceso',
    loadComponent: () =>
      import('./features/portal/portal-auth/portal-auth.component').then((m) => m.PortalAuthComponent),
    title: 'Acceso Clientes — Advance Capital',
  },
  {
    path: 'portal',
    loadComponent: () =>
      import('./features/portal/portal-layout/portal-layout.component').then((m) => m.PortalLayoutComponent),
    canActivate: [clientGuard],
    title: 'Portal del Inversionista — Advance Capital',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/portal/overview/overview.component').then((m) => m.OverviewComponent),
        title: 'Resumen — Portal Advance Capital',
      },
      {
        path: 'inversiones',
        loadComponent: () =>
          import('./features/portal/investments/investments.component').then((m) => m.InvestmentsComponent),
        title: 'Mis Inversiones — Portal Advance Capital',
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./features/portal/history/history.component').then((m) => m.HistoryComponent),
        title: 'Historial — Portal Advance Capital',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/portal/reports/reports.component').then((m) => m.ReportsComponent),
        title: 'Reportes — Portal Advance Capital',
      },
      {
        path: 'noticias',
        loadComponent: () =>
          import('./features/portal/news/news.component').then((m) => m.NewsComponent),
        title: 'Noticias — Portal Advance Capital',
      },
    ],
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
