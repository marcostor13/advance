import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // anchorScrolling hace que routerLink + fragment salte a la sección; sin esto el fragmento se ignora.
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // El router salta con window.scrollTo, que ignora scroll-margin-top: el offset
    // del navbar fijo hay que dárselo aquí. Se lee en cada salto, así sigue a --header-height.
    provideAppInitializer(() => {
      const scroller = inject(ViewportScroller);
      scroller.setOffset(() => {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
        return [0, (parseInt(raw, 10) || 120) + 24];
      });
    }),
    provideHttpClient(withInterceptors([apiInterceptor, authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
  ],
};
