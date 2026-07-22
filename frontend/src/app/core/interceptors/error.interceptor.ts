import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'ag_token';
const USER_KEY = 'ag_user';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        req.url.startsWith(environment.apiUrl) &&
        !req.url.endsWith('/auth/login')
      ) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        const target = router.url.startsWith('/admin') ? '/admin/login' : '/portal/login';
        router.navigate([target]);
      }
      return throwError(() => err);
    }),
  );
};
