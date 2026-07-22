import { Routes } from '@angular/router';
import { adminGuard, authGuard, portalGuard } from './core/guards/auth.guard';

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
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
    title: 'Recuperar contraseña — Advance Group',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
    title: 'Restablecer contraseña — Advance Group',
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./features/auth/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
    canActivate: [authGuard],
    title: 'Cambiar contraseña — Advance Group',
  },
  {
    path: 'portal/login',
    loadComponent: () =>
      import('./features/portal/portal-login/portal-login.component').then((m) => m.PortalLoginComponent),
    title: 'Portal de Inversionistas — Advance Group',
  },
  {
    path: 'portal',
    loadComponent: () =>
      import('./features/portal/portal-layout.component').then((m) => m.PortalLayoutComponent),
    canActivate: [portalGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/portal/resumen/resumen.component').then((m) => m.ResumenComponent),
        title: 'Resumen — Advance Group',
      },
      {
        path: 'inversiones',
        loadComponent: () =>
          import('./features/portal/inversiones/inversiones.component').then((m) => m.InversionesComponent),
        title: 'Mis Inversiones — Advance Group',
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./features/portal/historial/historial.component').then((m) => m.HistorialComponent),
        title: 'Historial — Advance Group',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/portal/reportes/reportes.component').then((m) => m.ReportesComponent),
        title: 'Reportes — Advance Group',
      },
      {
        path: 'noticias',
        loadComponent: () =>
          import('./features/portal/noticias/noticias.component').then((m) => m.NoticiasComponent),
        title: 'Noticias — Advance Group',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 — Advance Group',
  },
];
