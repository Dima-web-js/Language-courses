import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

const LANG_STORAGE_KEY = 'app-lang';

function getInitialLang(platformId: object): string {
  if (isPlatformBrowser(platformId)) {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return stored === 'ru' || stored === 'en' ? stored : 'ru';
  }
  return 'ru';
}

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, TranslocoModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  host: {
    ngSkipHydration: 'true',
  },
})
export class LanguageSwitcherComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isBrowser = isPlatformBrowser(this.platformId);
  lang: string;
  readonly langs = [
    { id: 'ru', name: 'русский' },
    { id: 'en', name: 'английский' },
  ];

  constructor() {
    this.lang = getInitialLang(this.platformId);
  }

  onLangChange($event: { value: string }): void {
    const value = $event.value;
    this.transloco.setActiveLang(value);
    if (this.isBrowser) {
      localStorage.setItem(LANG_STORAGE_KEY, value);
    }
  }
}
