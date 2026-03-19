import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { environment } from '../../environments/environment.dev';
import { AuthLoginResponse, LoginFormData } from '../interfaces/login-form.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let originalLocalStorage: Storage | undefined;
  let store: Record<string, string>;
  let localStorageMock: Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'>;

  beforeEach(() => {
    // Make localStorage deterministic for tests (and ensure it exists).
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

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    // Restore original localStorage (if any)
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should POST to /auth/login and save session to localStorage', () => {
    const credentials: LoginFormData = { email: 'a@b.com', password: 'pw' };
    const response: AuthLoginResponse = {
      access_token: 'token',
      email: 'a@b.com',
      role: 'student',
    };

    service.login(credentials).subscribe((body) => {
      expect(body).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(response);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('email', 'a@b.com');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('role', 'student');
  });

  it('getAccessToken/getEmail/getRole should read from localStorage', () => {
    store['accessToken'] = 't';
    store['email'] = 'e';
    store['role'] = 'r';

    expect(service.getAccessToken()).toBe('t');
    expect(service.getEmail()).toBe('e');
    expect(service.getRole()).toBe('r');
  });

  it('isAuthenticated should be true when token exists', () => {
    vi.spyOn(service, 'getAccessToken').mockReturnValue('token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('isAuthenticated should be false when token is null', () => {
    vi.spyOn(service, 'getAccessToken').mockReturnValue(null);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('logout should clear localStorage and navigate to /login', () => {
    service.logout();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('email');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('role');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
