import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<unknown>;
  addedAt: number;
}

// 60 seconds, потом новый запрос
const CACHE_TTL_MS = 60_000;

const cache = new Map<string, CacheEntry>();

export const cacheInterceptor: HttpInterceptorFn = (
  req,
  next
): Observable<HttpEvent<unknown>> => {
  // Кэшируем только GET-запросы к нашему API
  if (req.method !== 'GET' || !req.url.includes('/api/')) {
    return next(req);
  }

  const now = Date.now();

  // В ключ кэша включаем URL + query + токен, чтобы не смешивать разных пользователей
  const auth = req.headers.get('Authorization') ?? '';
  const cacheKey = `${req.method} ${req.urlWithParams} auth=${auth}`;

  const cached = cache.get(cacheKey);

  if (cached && now - cached.addedAt < CACHE_TTL_MS) {
    // Возвращаем кэшированный ответ
    return of(cached.response.clone());
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        // Не кэшируем ответы с явным запретом
        const cacheControl = event.headers.get('Cache-Control') ?? '';
        if (cacheControl.includes('no-store')) {
          return;
        }

        cache.set(cacheKey, {
          response: event.clone(),
          addedAt: now,
        });
      }
    })
  );
};

