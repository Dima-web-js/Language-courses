import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { LoginPage } from './login-page';
import { AuthStore } from '../../shared/store/auth.store';

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

describe('LoginPage', () => {
  let component: LoginPage;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LoginPage],
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

    const fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('passwordVisible should start as false', () => {
    expect(component.passwordVisible()).toBe(false);
  });

  it('togglePasswordVisibility should toggle passwordVisible', () => {
    component.togglePasswordVisibility();
    expect(component.passwordVisible()).toBe(true);

    component.togglePasswordVisibility();
    expect(component.passwordVisible()).toBe(false);
  });

  it('clearErrorOnFieldTouch should call authStore.clearError', () => {
    component.clearErrorOnFieldTouch();
    expect(mockAuthStore.clearError).toHaveBeenCalled();
  });

  it('onSubmit should prevent default and call authStore.login', () => {
    const event = new Event('submit');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    component.loginModel.set({ email: 'test@test.com', password: '12345' });
    component.onSubmit(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockAuthStore.clearError).toHaveBeenCalled();
    expect(mockAuthStore.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '12345' });
  });

  it('loginModel should have initial empty values', () => {
    expect(component.loginModel()).toEqual({ email: '', password: '' });
  });

  it('should render error banner when authStore.error has value', () => {
    const fixture = TestBed.createComponent(LoginPage);
    const comp = fixture.componentInstance;

    mockAuthStore.error.set('Ошибка входа');
    fixture.detectChanges();

    const banner: HTMLElement | null = fixture.nativeElement.querySelector('.error-banner');
    expect(banner).not.toBeNull();
    expect(banner?.textContent).toContain('Ошибка входа');
  });

  it('should bind password visibility toggle to icon and input type in template', () => {
    const fixture = TestBed.createComponent(LoginPage);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[autocomplete=\"current-password\"]');
    const toggleBtn: HTMLButtonElement =
      fixture.nativeElement.querySelector('button[mat-icon-button]');
    const icon: HTMLElement = fixture.nativeElement.querySelector('mat-icon');

    expect(input.type).toBe('password');
    expect(icon.textContent?.trim()).toBe('visibility');

    toggleBtn.click();
    fixture.detectChanges();

    expect(input.type).toBe('text');
    expect(icon.textContent?.trim()).toBe('visibility_off');
  });
});
