// авторизация на сигналах (написал сам, обучение)
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthState } from '../interfaces/state-interfaces/auth-inter-st.model';
import { computed, inject } from '@angular/core';
import { AuthServiceSt } from '../services/auth-st.service';
import { LoginRequest } from '../interfaces/state-interfaces/auth-inter-st.model';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';




const initialState: AuthState = {
  accessToken: null,
  email: null,
  role: null,
  error: null,
  loading: false,
};

export const AuthStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.accessToken()) // !! - преобразует любое значение в строгий булеан 
  })),

  withMethods((
    store,
    authService = inject(AuthServiceSt),
    router = inject(Router)
  ) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((body) =>
          authService.login(body).pipe(
            tap((response) => {
              patchState(store, {
                accessToken: response.accessToken,
                email: response.email,
                role: response.role,
                error: null,
                loading: false,
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
      patchState(store, initialState);
      authService.logout();
      
    },
  }))
);
