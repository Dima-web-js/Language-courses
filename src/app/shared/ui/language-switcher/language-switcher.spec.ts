import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader, TranslocoService } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from './language-switcher';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translocoService: TranslocoService;

  let originalLocalStorage: Storage | undefined;
  let store: Record<string, string>;
  let localStorageMock: Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'>;

  beforeEach(() => {
    // детерминированный mock localStorage для каждого теста
    originalLocalStorage = (globalThis as unknown as { localStorage?: Storage }).localStorage;
    store = {};
    localStorageMock = {
      getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    });
  });

  describe('in browser environment', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LanguageSwitcherComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideTransloco({
            config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
            loader: MockLoader,
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LanguageSwitcherComponent);
      component = fixture.componentInstance;
      translocoService = TestBed.inject(TranslocoService);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('isBrowser should be true in browser environment', () => {
      expect(component.isBrowser).toBe(true);
    });

    it('should have ru and en in langs list', () => {
      const ids = component.langs.map((l) => l.id);
      expect(ids).toContain('ru');
      expect(ids).toContain('en');
    });

    it('langs should have 2 items', () => {
      expect(component.langs.length).toBe(2);
    });

    it('onLangChange should call transloco.setActiveLang', () => {
      const setLangSpy = vi.spyOn(translocoService, 'setActiveLang');
      component.onLangChange({ value: 'en' });
      expect(setLangSpy).toHaveBeenCalledWith('en');
    });

    it('onLangChange should save lang to localStorage in browser', () => {
      component.onLangChange({ value: 'en' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('app-lang', 'en');
    });

    it('lang should default to stored value from localStorage', () => {
      store['app-lang'] = 'en';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [LanguageSwitcherComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideTransloco({
            config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
            loader: MockLoader,
          }),
        ],
      });

      const f = TestBed.createComponent(LanguageSwitcherComponent);
      expect(f.componentInstance.lang).toBe('en');
    });

    it('lang should default to ru when localStorage has unknown value', () => {
      store['app-lang'] = 'fr';

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [LanguageSwitcherComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' },
          provideTransloco({
            config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
            loader: MockLoader,
          }),
        ],
      });

      const f = TestBed.createComponent(LanguageSwitcherComponent);
      expect(f.componentInstance.lang).toBe('ru');
    });

    it('template should render options for all languages', async () => {
      fixture.detectChanges();

      // mat-option lives in the CDK overlay — must open the panel first
      const trigger: HTMLElement | null =
        fixture.nativeElement.querySelector('.mat-mdc-select-trigger');
      trigger?.click();
      fixture.detectChanges();
      await fixture.whenStable();

      const options: NodeListOf<HTMLElement> = document.querySelectorAll('mat-option');
      expect(options.length).toBe(component.langs.length);

      document.body.click();
      fixture.detectChanges();
    });
  });

  describe('in server environment', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [LanguageSwitcherComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          provideTransloco({
            config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
            loader: MockLoader,
          }),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LanguageSwitcherComponent);
      component = fixture.componentInstance;
      translocoService = TestBed.inject(TranslocoService);
    });

    it('isBrowser should be false in server environment', () => {
      expect(component.isBrowser).toBe(false);
    });

    it('lang should default to ru on server', () => {
      expect(component.lang).toBe('ru');
    });

    it('onLangChange should call transloco.setActiveLang on server', () => {
      const setLangSpy = vi.spyOn(translocoService, 'setActiveLang');
      component.onLangChange({ value: 'en' });
      expect(setLangSpy).toHaveBeenCalledWith('en');
    });

    it('onLangChange should not touch localStorage on server', () => {
      component.onLangChange({ value: 'en' });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });
});
