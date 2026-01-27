import { Injectable } from '@angular/core';
import { Course } from '../interfaces/course.model';
import { COURSES_DATA } from '../pages/main-page/main-page';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  getCourses(): Course[] {
    return COURSES_DATA;
  }

  getCourseById(id: number): Course | undefined {
    return COURSES_DATA.find((course) => course.id === id);
  }
}
