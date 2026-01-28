import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_LOGIN_PATH = '/auth/login';
const STORAGE_KEY_ACCESS_TOKEN = 'accessToken';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(AUTH_LOGIN_PATH)) {
    return next(req);
  }

  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN)
      : null;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
