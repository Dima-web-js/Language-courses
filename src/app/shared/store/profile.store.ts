import { effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, map, of, pipe, switchMap, tap } from 'rxjs';
import { Profile } from '../services/profile.service';
import { ProfileState } from '../interfaces/state-interfaces/profile-state.interface';

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store) {
      effect(() => {
        const state = {
          profile: store.profile()
            ? { name: store.profile()!.name, email: store.profile()!.email, role: store.profile()!.role }
            : null,
          loading: store.loading(),
          error: store.error(),
        };
        console.log('[ProfileStore]', state);
      });
    },
  }),
  withMethods((store, profileService = inject(Profile)) => ({
    loadProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          profileService.getProfile().pipe(
            map((profile) => {
              patchState(store, {
                profile,
                loading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message || 'Ошибка загрузки профиля',
              });
              return of(null);
            })
          )
        )
      )
    ),

    clearProfile(): void {
      patchState(store, initialState);
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  }))
);
