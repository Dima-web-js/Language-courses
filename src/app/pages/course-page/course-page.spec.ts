import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { CoursePage } from './course-page';
import { CoursesStore } from '../../shared/store/courses.store';
import { Course } from '../../shared/interfaces/course.model';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

const mockCurrentCourse = signal<Course | null>(null);
const mockCoursesStore = {
  courses: signal([]),
  loading: signal(false),
  error: signal<string | null>(null),
  currentCourse: mockCurrentCourse,
  currentLesson: signal(null),
  loadCourses: vi.fn(),
  loadCourseById: vi.fn(),
  loadLesson: vi.fn(),
  clearCurrentCourse: vi.fn(),
  clearCurrentLesson: vi.fn(),
  clearError: vi.fn(),
};

function createMockRoute(params: Record<string, string> = {}) {
  return {
    snapshot: {
      paramMap: {
        get: (key: string) => params[key] ?? null,
      },
    },
  };
}

describe('CoursePage', () => {
  let component: CoursePage;
  let router: Router;

  function setup(routeParams: Record<string, string> = {}) {
    return TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: CoursesStore, useValue: mockCoursesStore },
        { provide: ActivatedRoute, useValue: createMockRoute(routeParams) },
        provideTransloco({
          config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
          loader: MockLoader,
        }),
      ],
    }).compileComponents();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCurrentCourse.set(null);
    await setup();

    const fixture = TestBed.createComponent(CoursePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lessonsDisplayedColumns should contain correct columns', () => {
    expect(component.lessonsDisplayedColumns).toEqual(['title', 'duration', 'progress']);
  });

  it('ngOnInit with valid id should call loadCourseById', async () => {
    TestBed.resetTestingModule();
    await setup({ id: '42' });

    const fixture = TestBed.createComponent(CoursePage);
    const comp = fixture.componentInstance;
    comp.ngOnInit();

    expect(mockCoursesStore.loadCourseById).toHaveBeenCalledWith(42);
  });

  it('ngOnInit without id param should not call loadCourseById', () => {
    component.ngOnInit();
    expect(mockCoursesStore.loadCourseById).not.toHaveBeenCalled();
  });

  it('openLesson should navigate to lesson page', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.openLesson(10, 5);
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/course', 10, 'lesson', 5]);
  });

  it('goBack should navigate to list of courses', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/list-of-courses']);
  });

  it('template should render course title and lessons table when currentCourse is set', async () => {
    const fixture = TestBed.createComponent(CoursePage);

    mockCurrentCourse.set({
      id: 1,
      name: 'Course1',
      category: 'adults',
      level: 'A1',
      rate: 5,
      author: 'Author',
      theme: 'Theme',
      language: 'EN',
      description: 'Desc',
      goals: ['Goal1'],
      program: 'Program',
      lessons: [
        { id: 1, title: 'Lesson1', duration: 10, videoUrl: '', previousLessonId: null, nextLessonId: null },
      ],
    } as Course);

    mockCoursesStore.loading.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const title: HTMLElement | null = fixture.nativeElement.querySelector('mat-card-title');
    expect(title?.textContent).toContain('Course1');

    // Angular Material MDC uses [mat-row] attribute
    const rows: NodeListOf<HTMLTableRowElement> =
      fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Lesson1');
  });
});
