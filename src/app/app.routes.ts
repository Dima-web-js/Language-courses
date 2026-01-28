import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'platform',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/main/main').then((m) => m.Main),
    children: [
      { path: '', redirectTo: 'list-of-courses', pathMatch: 'full' },
      {
        path: 'list-of-courses',
        loadComponent: () =>
          import('./pages/main-page/main-page').then((m) => m.MainPage),
      },
      {
        path: 'course/:id',
        loadComponent: () =>
          import('./pages/course-page/course-page').then((m) => m.CoursePage),
      },
      {
        path: 'course/:courseId/lesson/:lessonId',
        loadComponent: () =>
          import('./pages/lesson-page/lesson-page').then((m) => m.LessonPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile-page/profile-page').then((m) => m.ProfilePage),
      },
      {
        path: 'create-course',
        loadComponent: () =>
          import('./pages/create-course-page/create-course-page').then(
            (m) => m.CreateCoursePage
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
