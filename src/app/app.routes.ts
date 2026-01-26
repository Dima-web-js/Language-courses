import { Routes } from '@angular/router';
import { MainPage } from './pages/main-page/main-page';

export const routes: Routes = [
  {path: '', redirectTo: 'list-of-courses', pathMatch: 'full' },
  {path: 'list-of-courses', component: MainPage }
];
