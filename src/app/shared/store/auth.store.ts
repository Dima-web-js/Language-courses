import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginFormData } from '../interfaces/login-form.model';
import { Router } from '@angular/router';
import { AuthState } from '../interfaces/state-interfaces/auth-state.interface';

const initialState: AuthState = {
  accessToken: null,
  email: null,
  role: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ accessToken }) => ({
    isAuthenticated: computed(() => !!accessToken()),
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        const state = {
          accessToken: store.accessToken() ? '***' : null,
          email: store.email(),
          role: store.role(),
          loading: store.loading(),
          error: store.error(),
        };
        console.log('[AuthStore]', state);
      });
    },
  }),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    initFromStorage(): void {
      const token = authService.getAccessToken();
      const email = authService.getEmail();
      const role = authService.getRole();

      if (token) {
        patchState(store, {
          accessToken: token,
          email,
          role,
        });
      }
    },

    login: rxMethod<LoginFormData>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((credentials) =>
          authService.login(credentials).pipe(
            tap((response) => {
              patchState(store, {
                accessToken: response.access_token,
                email: response.email,
                role: response.role,
                loading: false,
                error: null,
              });
              router.navigate(['/platform']);
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message || 'Ошибка входа',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    logout(): void {
      authService.logout();
      patchState(store, initialState);
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  }))
);
