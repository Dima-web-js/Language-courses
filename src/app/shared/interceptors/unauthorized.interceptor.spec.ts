import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { unauthorizedInterceptor } from './unauthorized.interceptor';
import { AuthService } from '../services/auth.service';

const mockLogout = vi.fn();
const mockAuthService = { logout: mockLogout };

function setupTestBed(platformId: string) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      provideHttpClient(withInterceptors([unauthorizedInterceptor])),
      provideHttpClientTesting(),
      { provide: AuthService, useValue: mockAuthService },
      { provide: PLATFORM_ID, useValue: platformId },
    ],
  });
}

describe('unauthorizedInterceptor', () => {
  describe('in browser environment', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let router: Router;

    beforeEach(() => {
      vi.clearAllMocks();
      setupTestBed('browser');
      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
      router = TestBed.inject(Router);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should call authService.logout on 401 when not on login page', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue('/platform/courses');

      http.get('/api/profile').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/profile');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(mockLogout).toHaveBeenCalledOnce();
    });

    it('should NOT call authService.logout on 401 when current URL includes /login', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue('/login');

      http.get('/api/profile').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/profile');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should NOT call authService.logout for non-401 errors', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue('/platform/courses');

      http.get('/api/profile').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/profile');
      req.flush(
        { message: 'Server Error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(mockLogout).not.toHaveBeenCalled();
    });

    it('should always rethrow the error to the caller', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue('/platform/courses');

      let caughtError: { status: number } | null = null;
      http
        .get('/api/profile')
        .subscribe({ error: err => (caughtError = err) });

      const req = httpMock.expectOne('/api/profile');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(caughtError).not.toBeNull();
      expect(caughtError!.status).toBe(401);
    });

    it('should pass through successful responses untouched', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue('/platform/courses');

      let result: unknown;
      http.get('/api/courses').subscribe(r => (result = r));

      const req = httpMock.expectOne('/api/courses');
      req.flush([{ id: 1 }]);

      expect(result).toEqual([{ id: 1 }]);
      expect(mockLogout).not.toHaveBeenCalled();
    });
  });

  describe('in server environment', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let router: Router;

    beforeEach(() => {
      vi.clearAllMocks();
      setupTestBed('server');
      http = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
      router = TestBed.inject(Router);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should NOT call authService.logout on 401 when running on server', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue('/platform/courses');

      http.get('/api/profile').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/profile');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(mockLogout).not.toHaveBeenCalled();
    });
  });
});
