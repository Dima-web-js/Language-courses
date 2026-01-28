import { APP_INITIALIZER, ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authTokenInterceptor } from './shared/interceptors/auth-token.interceptor';
import { unauthorizedInterceptor } from './shared/interceptors/unauthorized.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';

const LANG_STORAGE_KEY = 'app-lang';

function initLangFromStorage(transloco: TranslocoService) {
  return () => {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    const lang = stored === 'ru' || stored === 'en' ? stored : 'ru';
    if (!stored) {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
    transloco.setActiveLang(lang);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authTokenInterceptor, unauthorizedInterceptor])
    ),
    provideClientHydration(withEventReplay()),
    provideTransloco({
      config: {
        availableLangs: ['ru', 'en'],
        defaultLang: 'ru',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: {
          useFallbackTranslation: true,
        },
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initLangFromStorage,
      deps: [TranslocoService],
      multi: true,
    },
  ],
};
