import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // На сервере (SSR) не знаем о localStorage, поэтому не редиректим на логин.
  // Полная проверка выполняется уже в браузере.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authStore.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
