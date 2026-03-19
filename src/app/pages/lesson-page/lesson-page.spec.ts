import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { LessonPage } from './lesson-page';
import { CoursesStore } from '../../shared/store/courses.store';
import { LessonContent } from '../../shared/interfaces/course.model';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

const mockLesson = signal<LessonContent | null>(null);
const mockCoursesStore = {
  courses: signal([]),
  loading: signal(false),
  error: signal<string | null>(null),
  currentCourse: signal(null),
  currentLesson: mockLesson,
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

describe('LessonPage', () => {
  let component: LessonPage;
  let router: Router;

  function setup(routeParams: Record<string, string> = {}) {
    return TestBed.configureTestingModule({
      imports: [LessonPage],
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
    mockLesson.set(null);
    await setup();

    const fixture = TestBed.createComponent(LessonPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('courseId and lessonId should start as null', () => {
    expect(component.courseId()).toBeNull();
    expect(component.lessonId()).toBeNull();
  });

  it('ngOnInit with valid params should call loadLesson and set ids', async () => {
    TestBed.resetTestingModule();
    await setup({ courseId: '3', lessonId: '7' });

    const fixture = TestBed.createComponent(LessonPage);
    const comp = fixture.componentInstance;

    comp.ngOnInit();

    expect(mockCoursesStore.loadLesson).toHaveBeenCalledWith({ courseId: 3, lessonId: 7 });
    expect(comp.courseId()).toBe(3);
    expect(comp.lessonId()).toBe(7);
  });

  it('ngOnInit with missing params should not call loadLesson', () => {
    component.ngOnInit();
    expect(mockCoursesStore.loadLesson).not.toHaveBeenCalled();
  });

  it('hasNextLesson should return false when no lesson', () => {
    mockLesson.set(null);
    expect(component.hasNextLesson()).toBe(false);
  });

  it('hasNextLesson should return true when nextLessonId exists', () => {
    mockLesson.set({ id: 1, title: 'T', videoUrl: '', previousLessonId: null, nextLessonId: 2 });
    expect(component.hasNextLesson()).toBe(true);
  });

  it('hasNextLesson should return false when nextLessonId is null', () => {
    mockLesson.set({ id: 1, title: 'T', videoUrl: '', previousLessonId: null, nextLessonId: null });
    expect(component.hasNextLesson()).toBe(false);
  });

  it('hasPreviousLesson should return false when no lesson', () => {
    mockLesson.set(null);
    expect(component.hasPreviousLesson()).toBe(false);
  });

  it('hasPreviousLesson should return true when previousLessonId exists', () => {
    mockLesson.set({ id: 2, title: 'T', videoUrl: '', previousLessonId: 1, nextLessonId: null });
    expect(component.hasPreviousLesson()).toBe(true);
  });

  it('goBackToCourse should not navigate when courseId is null', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.goBackToCourse();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('goBackToCourse should navigate to course when courseId is set', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.courseId.set(3);
    component.goBackToCourse();
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/course', 3]);
  });

  it('goToNextLesson should navigate when nextLessonId and courseId exist', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.courseId.set(3);
    mockLesson.set({ id: 1, title: 'T', videoUrl: '', previousLessonId: null, nextLessonId: 2 });
    component.goToNextLesson();
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/course', 3, 'lesson', 2]);
  });

  it('goToNextLesson should not navigate when nextLessonId is null', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.courseId.set(3);
    mockLesson.set({ id: 1, title: 'T', videoUrl: '', previousLessonId: null, nextLessonId: null });
    component.goToNextLesson();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('goToPreviousLesson should navigate when previousLessonId and courseId exist', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.courseId.set(3);
    mockLesson.set({ id: 2, title: 'T', videoUrl: '', previousLessonId: 1, nextLessonId: null });
    component.goToPreviousLesson();
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/course', 3, 'lesson', 1]);
  });

  it('template should show loading spinner when coursesStore.loading is true', () => {
    const fixture = TestBed.createComponent(LessonPage);
    mockCoursesStore.loading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();
  });

  it('template should render next and previous buttons based on hasNextLesson/hasPreviousLesson', () => {
    const fixture = TestBed.createComponent(LessonPage);

    mockCoursesStore.loading.set(false);
    mockLesson.set({
      id: 1,
      title: 'Lesson 1',
      videoUrl: '',
      previousLessonId: null,
      nextLessonId: 2,
    });

    fixture.detectChanges();

    // Transloco returns empty string for missing translations, so we check structure:
    // next button contains '→', previous button contains '←'
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.lesson-actions button');
    // back button + next button = 2; no previous button
    expect(buttons.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('→');
    expect(fixture.nativeElement.textContent).not.toContain('←');

    mockLesson.set({
      id: 2,
      title: 'Lesson 2',
      videoUrl: '',
      previousLessonId: 1,
      nextLessonId: null,
    });
    fixture.detectChanges();

    const buttons2: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.lesson-actions button');
    // back button + previous button = 2; no next button
    expect(buttons2.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('←');
    expect(fixture.nativeElement.textContent).not.toContain('→');
  });
});
