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
import { CoursesService } from '../services/courses.service';
import { CoursesState } from '../interfaces/state-interfaces/courses-state.interface';

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  currentLesson: null,
  loading: false,
  error: null,
};

export const CoursesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store) {
      effect(() => {
        const state = {
          coursesCount: store.courses().length,
          currentCourseId: store.currentCourse()?.id ?? null,
          currentLessonId: store.currentLesson()?.id ?? null,
          loading: store.loading(),
          error: store.error(),
        };
        console.log('[CoursesStore]', state);
      });
    },
  }),
  withMethods((store, coursesService = inject(CoursesService)) => ({
    loadCourses: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          coursesService.getCourses().pipe(
            map((courses) => {
              patchState(store, {
                courses,
                loading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message || 'Ошибка загрузки курсов',
              });
              return of(null);
            })
          )
        )
      )
    ),

    loadCourseById: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) =>
          coursesService.getCourseById(id).pipe(
            map((course) => {
              patchState(store, {
                currentCourse: course,
                loading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message || 'Ошибка загрузки курса',
              });
              return of(null);
            })
          )
        )
      )
    ),

    loadLesson: rxMethod<{ courseId: number; lessonId: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ courseId, lessonId }) =>
          coursesService.getLessonById(courseId, lessonId).pipe(
            map((lesson) => {
              patchState(store, {
                currentLesson: lesson,
                loading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                loading: false,
                error: error.message || 'Ошибка загрузки урока',
              });
              return of(null);
            })
          )
        )
      )
    ),

    clearCurrentCourse(): void {
      patchState(store, { currentCourse: null });
    },

    clearCurrentLesson(): void {
      patchState(store, { currentLesson: null });
    },

    clearError(): void {
      patchState(store, { error: null });
    },
  }))
);
