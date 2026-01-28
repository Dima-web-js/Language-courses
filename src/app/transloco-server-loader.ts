import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import ruTranslations from '../assets/i18n/ru.json';
import enTranslations from '../assets/i18n/en.json';

@Injectable({ providedIn: 'root' })
export class TranslocoServerLoader implements TranslocoLoader {
  private translations: Record<string, Translation> = {
    ru: ruTranslations,
    en: enTranslations,
  };

  getTranslation(lang: string): Observable<Translation> {
    return of(this.translations[lang] || this.translations['ru']);
  }
}
