import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { MainPage } from './main-page';
import { CoursesStore } from '../../shared/store/courses.store';
import { CourseListItem } from '../../shared/interfaces/course.model';
import { ALL_FILTER_VALUE } from '../../shared/ui/filters/filters';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

const mockCourses = signal<CourseListItem[]>([]);
const mockCoursesStore = {
  courses: mockCourses,
  loading: signal(false),
  error: signal<string | null>(null),
  currentCourse: signal(null),
  currentLesson: signal(null),
  loadCourses: vi.fn(),
  loadCourseById: vi.fn(),
  loadLesson: vi.fn(),
  clearCurrentCourse: vi.fn(),
  clearCurrentLesson: vi.fn(),
  clearError: vi.fn(),
};

describe('MainPage', () => {
  let component: MainPage;
  let router: Router;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCourses.set([]);

    await TestBed.configureTestingModule({
      imports: [MainPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: CoursesStore, useValue: mockCoursesStore },
        provideTransloco({
          config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
          loader: MockLoader,
        }),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MainPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call loadCourses', () => {
    component.ngOnInit();
    expect(mockCoursesStore.loadCourses).toHaveBeenCalled();
  });

  it('themeOptions should return unique sorted themes from courses', () => {
    mockCourses.set([
      { id: 1, name: '', category: 'adults', level: 'A1', rate: 5, author: '', theme: 'Grammar', language: '' },
      { id: 2, name: '', category: 'adults', level: 'A2', rate: 4, author: '', theme: 'Business', language: '' },
      { id: 3, name: '', category: 'adults', level: 'B1', rate: 3, author: '', theme: 'Grammar', language: '' },
    ] as CourseListItem[]);
    expect(component.themeOptions()).toEqual(['Business', 'Grammar']);
  });

  it('themeOptions should return empty array when no courses', () => {
    mockCourses.set([]);
    expect(component.themeOptions()).toEqual([]);
  });

  it('onSearchChange should update searchFilterText', () => {
    component.onSearchChange('angular');
    expect(component.searchFilterText).toBe('angular');
  });

  it('onThemeChange should set selectedTheme signal', () => {
    component.onThemeChange('Business');
    expect(component.selectedTheme()).toBe('Business');
  });

  it('onThemeChange with empty value should reset to ALL_FILTER_VALUE', () => {
    component.onThemeChange('');
    expect(component.selectedTheme()).toBe(ALL_FILTER_VALUE);
  });

  it('onLevelChange should set selectedLevel signal', () => {
    component.onLevelChange('B2');
    expect(component.selectedLevel()).toBe('B2');
  });

  it('onLevelChange with empty value should reset to ALL_FILTER_VALUE', () => {
    component.onLevelChange('');
    expect(component.selectedLevel()).toBe(ALL_FILTER_VALUE);
  });

  it('onLanguageChange should set selectedLanguage signal', () => {
    component.onLanguageChange('Английский');
    expect(component.selectedLanguage()).toBe('Английский');
  });

  it('selectedTheme should start with ALL_FILTER_VALUE', () => {
    expect(component.selectedTheme()).toBe(ALL_FILTER_VALUE);
  });

  it('openCourse should navigate to course page', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.openCourse(5);
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/course', 5]);
  });

  it('languageOptions should contain expected values', () => {
    expect(component.languageOptions).toContain('Английский');
    expect(component.languageOptions).toContain('Англ-рус');
  });

  it('should render rows for courses in table', async () => {
    const fixture = TestBed.createComponent(MainPage);

    mockCourses.set([
      { id: 1, name: 'Course1', category: 'adults', level: 'A1', rate: 5, author: 'A', theme: 'T', language: 'L' },
      { id: 2, name: 'Course2', category: 'children', level: 'A2', rate: 4, author: 'B', theme: 'T2', language: 'L2' },
    ] as CourseListItem[]);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Angular Material MDC uses [mat-row] attribute (class may vary by version)
    const rows: NodeListOf<HTMLTableRowElement> =
      fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Course1');
    expect(rows[1].textContent).toContain('Course2');
  });

  it('should render no-data row when there are no courses', async () => {
    const fixture = TestBed.createComponent(MainPage);
    const comp = fixture.componentInstance;

    mockCourses.set([]);
    comp.searchFilterText = 'something';
    comp.onSearchChange('something');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Transloco returns empty string for missing translations; check the plain interpolation value
    const tableText: string = fixture.nativeElement.querySelector('table').textContent;
    expect(tableText).toContain('"something"');
  });
});
