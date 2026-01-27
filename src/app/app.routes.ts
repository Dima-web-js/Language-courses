import { Routes } from '@angular/router';
import { MainPage } from './pages/main-page/main-page';
import { CoursePage } from './pages/course-page/course-page';
import { LessonPage } from './pages/lesson-page/lesson-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { CreateCoursePage } from './pages/create-course-page/create-course-page';

export const routes: Routes = [
  { path: '', redirectTo: 'list-of-courses', pathMatch: 'full' },
  { path: 'list-of-courses', component: MainPage },
  { path: 'course/:id', component: CoursePage },
  { path: 'course/:courseId/lesson/:lessonId', component: LessonPage },
  { path: 'profile', component: ProfilePage },
  { path: 'create-course', component: CreateCoursePage },
];
