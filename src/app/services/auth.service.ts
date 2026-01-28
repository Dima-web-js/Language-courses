import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment.dev';


export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
  email: string;
  role: string;
}

const STORAGE_KEYS = {
  accessToken: 'accessToken',
  email: 'email',
  role: 'role',
} as const;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly baseUrl = environment.apiUrl;

  login(credentials: AuthLoginRequest): Observable<AuthLoginResponse> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post<AuthLoginResponse>(url, credentials).pipe(
      tap((body) => this.saveSession(body))
    );
  }

  private saveSession(data: AuthLoginResponse): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.accessToken, data.access_token);
    localStorage.setItem(STORAGE_KEYS.email, data.email);
    localStorage.setItem(STORAGE_KEYS.role, data.role);
  }

  getAccessToken(): string | null {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.accessToken)
      : null;
  }

  getEmail(): string | null {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.email)
      : null;
  }

  getRole(): string | null {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.role)
      : null;
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() != null;
  }

  logout(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.email);
    localStorage.removeItem(STORAGE_KEYS.role);
    this.router.navigate(['']);
  }
}
