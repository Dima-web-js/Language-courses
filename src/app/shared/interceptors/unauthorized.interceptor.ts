import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';


export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((err) => {
      if (
        err.status === 401 &&
        !router.url.includes('/login') &&
        isPlatformBrowser(platformId)
      ) {
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};
