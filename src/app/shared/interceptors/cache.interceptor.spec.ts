import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { cacheInterceptor } from './cache.interceptor';

// Each test uses a unique URL so module-level cache Map never causes collisions
let urlCounter = 0;
const uniqueUrl = (path = 'test') => `/api/${path}-${++urlCounter}`;

describe('cacheInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([cacheInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through POST requests without caching', () => {
    const url = uniqueUrl('post');
    http.post(url, { data: 1 }).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('should pass through PUT requests without caching', () => {
    const url = uniqueUrl('put');
    http.put(url, {}).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should pass through GET requests outside /api/ without caching', () => {
    http.get('/other/endpoint').subscribe();
    const req1 = httpMock.expectOne('/other/endpoint');
    req1.flush([]);

    // Second request also goes through (not cached)
    http.get('/other/endpoint').subscribe();
    const req2 = httpMock.expectOne('/other/endpoint');
    req2.flush([]);
  });

  it('should cache GET /api/ response and return it on second call without a new HTTP request', () => {
    const url = uniqueUrl('courses');
    const mockData = [{ id: 1 }, { id: 2 }];

    let firstResult: unknown;
    http.get(url).subscribe(r => (firstResult = r));
    const req = httpMock.expectOne(url);
    req.flush(mockData);
    expect(firstResult).toEqual(mockData);

    // Second call should be served from cache — no new request reaches the testing controller
    let secondResult: unknown;
    http.get(url).subscribe(r => (secondResult = r));
    httpMock.expectNone(url);
    expect(secondResult).toEqual(mockData);
  });

  it('should include Authorization header in cache key so different users get separate entries', () => {
    const url = uniqueUrl('profile');

    // Request without token
    http.get(url).subscribe();
    const req1 = httpMock.expectOne(url);
    req1.flush({ role: 'guest' });

    // Request WITH token — different cache key, new HTTP call expected
    http
      .get(url, { headers: { Authorization: 'Bearer abc' } })
      .subscribe();
    const req2 = httpMock.expectOne(url);
    req2.flush({ role: 'admin' });
  });

  it('should NOT cache responses with Cache-Control: no-store', () => {
    const url = uniqueUrl('no-store');

    http.get(url).subscribe();
    const req1 = httpMock.expectOne(url);
    req1.flush({}, { headers: { 'Cache-Control': 'no-store' } });

    // Second call should NOT be cached — a new request is made
    http.get(url).subscribe();
    const req2 = httpMock.expectOne(url);
    req2.flush({});
  });

  it('should make a fresh HTTP request after TTL of 60 s expires', () => {
    const dateSpy = vi.spyOn(Date, 'now');
    const baseTime = 1_700_000_000_000;
    dateSpy.mockReturnValue(baseTime);

    const url = uniqueUrl('ttl');

    http.get(url).subscribe();
    const req1 = httpMock.expectOne(url);
    req1.flush({ version: 1 });

    // Still within TTL — served from cache
    http.get(url).subscribe();
    httpMock.expectNone(url);

    // Advance time by 61 s (past the 60 s TTL)
    dateSpy.mockReturnValue(baseTime + 61_000);

    http.get(url).subscribe();
    const req2 = httpMock.expectOne(url);
    req2.flush({ version: 2 });

    dateSpy.mockRestore();
  });
});
