import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { App } from './app';
import { AuthStore } from './shared/store/auth.store';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

const mockAuthStore = {
  accessToken: signal<string | null>(null),
  email: signal<string | null>(null),
  role: signal<string | null>(null),
  loading: signal(false),
  error: signal<string | null>(null),
  isAuthenticated: signal(false),
  initFromStorage: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn(),
};

describe('App', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthStore, useValue: mockAuthStore },
        provideTransloco({
          config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
          loader: MockLoader,
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('title signal should equal language-courses', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance['title']()).toBe('language-courses');
  });

  it('constructor should call authStore.initFromStorage', () => {
    TestBed.createComponent(App);
    expect(mockAuthStore.initFromStorage).toHaveBeenCalled();
  });
});
