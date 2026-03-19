import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { environment } from '../../environments/environment.dev';
import { Course, CourseListItem, LessonContent } from '../interfaces/course.model';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call correct URL when getCourses is called', () => {
    const mockCourses: CourseListItem[] = [];

    service.getCourses().subscribe((courses) => {
      expect(courses).toEqual(mockCourses);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/courses`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should call correct URL when getCourseById is called', () => {
    const courseId = 1;
    const mockCourse = {} as Course;

    service.getCourseById(courseId).subscribe((course) => {
      expect(course).toEqual(mockCourse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/courses/${courseId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourse);
  });

  it('should call correct URL when getLessonById is called', () => {
    const courseId = 1;
    const lessonId = 2;
    const mockLesson = {} as LessonContent;

    service.getLessonById(courseId, lessonId).subscribe((lesson) => {
      expect(lesson).toEqual(mockLesson);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/courses/${courseId}/lessons/${lessonId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockLesson);
  });
});
