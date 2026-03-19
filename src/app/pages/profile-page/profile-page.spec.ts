import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { ProfilePage } from './profile-page';
import { ProfileStore } from '../../shared/store/profile.store';
import { AuthStore } from '../../shared/store/auth.store';
import { ProfileModel } from '../../shared/interfaces/profile.model';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

const mockProfile = signal<ProfileModel | null>(null);
const mockProfileStore = {
  profile: mockProfile,
  loading: signal(false),
  error: signal<string | null>(null),
  loadProfile: vi.fn(),
  clearProfile: vi.fn(),
  clearError: vi.fn(),
};

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

describe('ProfilePage', () => {
  let component: ProfilePage;
  let router: Router;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockProfile.set(null);

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ProfileStore, useValue: mockProfileStore },
        { provide: AuthStore, useValue: mockAuthStore },
        provideTransloco({
          config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
          loader: MockLoader,
        }),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call profileStore.loadProfile', () => {
    component.ngOnInit();
    expect(mockProfileStore.loadProfile).toHaveBeenCalled();
  });

  it('goToCreateCourse should navigate to create-course page', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.goToCreateCourse();
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/create-course']);
  });

  it('logout should call authStore.logout and profileStore.clearProfile', () => {
    component.logout();
    expect(mockAuthStore.logout).toHaveBeenCalled();
    expect(mockProfileStore.clearProfile).toHaveBeenCalled();
  });

  it('roleLabel should return empty string when no profile', () => {
    mockProfile.set(null);
    expect(component.roleLabel()).toBe('');
  });

  it('roleLabel should return translated key for student role', () => {
    mockProfile.set({ name: 'Ivan', email: 'i@b.com', role: 'student' });
    // TranslocoService returns the key as-is in test mode
    expect(component.roleLabel()).toBe('Ученик');
  });

  it('roleLabel should return translated key for teacher role', () => {
    mockProfile.set({ name: 'Ivan', email: 'i@b.com', role: 'teacher' });
    expect(component.roleLabel()).toBe('Преподаватель');
  });

  it('should render loading spinner when profileStore.loading is true', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    mockProfileStore.loading.set(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).not.toBeNull();
  });

  it('should render teacher actions only for teacher role', () => {
    const fixture = TestBed.createComponent(ProfilePage);

    // студент
    mockProfile.set({ name: 'Student', email: 's@b.com', role: 'student' });
    mockProfileStore.loading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.teacher-actions')).toBeNull();

    // преподаватель
    mockProfile.set({ name: 'Teacher', email: 't@b.com', role: 'teacher' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.teacher-actions')).not.toBeNull();
  });
});
