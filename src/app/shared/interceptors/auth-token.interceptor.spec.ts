import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { authTokenInterceptor } from './auth-token.interceptor';

describe('authTokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  let store: Record<string, string>;
  let localStorageMock: Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'>;

  beforeEach(() => {
    store = {};
    localStorageMock = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, val: string) => {
        store[key] = val;
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
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should skip login requests and not add Authorization header', () => {
    store['accessToken'] = 'my-token';

    http.post('/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ token: 'new-token' });
  });

  it('should add Bearer Authorization header when token exists in localStorage', () => {
    store['accessToken'] = 'secret-token';

    http.get('/api/courses').subscribe();

    const req = httpMock.expectOne('/api/courses');
    expect(req.request.headers.get('Authorization')).toBe('Bearer secret-token');
    req.flush([]);
  });

  it('should not add Authorization header when no token in localStorage', () => {
    http.get('/api/courses').subscribe();

    const req = httpMock.expectOne('/api/courses');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('should not add Authorization header for non-login URL with empty token', () => {
    store['accessToken'] = '';

    http.get('/api/profile').subscribe();

    const req = httpMock.expectOne('/api/profile');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should forward the request to next handler', () => {
    let response: unknown;
    http.get('/api/courses').subscribe(r => (response = r));

    const req = httpMock.expectOne('/api/courses');
    req.flush([{ id: 1 }]);

    expect(response).toEqual([{ id: 1 }]);
  });
});
