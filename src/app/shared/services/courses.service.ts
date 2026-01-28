import { inject, Injectable } from '@angular/core';
import { Course, CourseListItem, Lesson, LessonContent } from '../interfaces/course.model';
import { environment } from '../../environments/environment.dev';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {

  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);


  getCourses(): Observable<CourseListItem[]> {
    return this.http.get<CourseListItem[]>(`${this.baseUrl}/courses`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${id}`);
  }

  getLessonById(courseId: number, lessonId: number): Observable<LessonContent> {
    return this.http.get<LessonContent>(`${this.baseUrl}/courses/${courseId}/lessons/${lessonId}`);
  }
}
