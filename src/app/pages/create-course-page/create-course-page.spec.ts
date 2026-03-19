import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { CreateCoursePage } from './create-course-page';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

describe('CreateCoursePage', () => {
  let component: CreateCoursePage;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCoursePage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideTransloco({
          config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
          loader: MockLoader,
        }),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CreateCoursePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('courseForm should be initialized with all required controls', () => {
    const controls = ['name', 'category', 'level', 'theme', 'language', 'description', 'goals', 'program', 'lessons'];
    controls.forEach((ctrl) => {
      expect(component.courseForm.contains(ctrl)).toBe(true);
    });
  });

  it('courseForm should be invalid when empty', () => {
    expect(component.courseForm.invalid).toBe(true);
  });

  it('courseForm should be valid when all required fields are filled', () => {
    component.courseForm.patchValue({
      name: 'English Course',
      category: 'adults',
      level: 'B1',
      theme: 'Общий английский',
      language: 'Английский',
      description: 'Course description',
    });
    expect(component.courseForm.valid).toBe(true);
  });

  it('onSubmit should not navigate when form is invalid', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onSubmit();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('onSubmit should navigate to list when form is valid', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.courseForm.patchValue({
      name: 'English Course',
      category: 'adults',
      level: 'B1',
      theme: 'Общий английский',
      language: 'Английский',
      description: 'Course description',
    });

    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/list-of-courses']);
  });

  it('cancel should navigate to profile page', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.cancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/platform/profile']);
  });

  it('categories should contain adults and children', () => {
    const values = component.categories.map((c) => c.value);
    expect(values).toContain('adults');
    expect(values).toContain('children');
  });

  it('levels should contain all 6 CEFR levels', () => {
    const values = component.levels.map((l) => l.value);
    ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].forEach((level) => {
      expect(values).toContain(level);
    });
  });

  it('languages should contain expected options', () => {
    const values = component.languages.map((l) => l.value);
    expect(values).toContain('Английский');
    expect(values).toContain('Англ-рус');
  });

  it('template should disable submit button when form is invalid and enable when valid', () => {
    const fixture = TestBed.createComponent(CreateCoursePage);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    const submitBtn: HTMLButtonElement =
      fixture.nativeElement.querySelector('button[type=\"submit\"]');
    expect(submitBtn.disabled).toBe(true);

    comp.courseForm.patchValue({
      name: 'English Course',
      category: 'adults',
      level: 'B1',
      theme: 'Общий английский',
      language: 'Английский',
      description: 'Course description',
    });
    fixture.detectChanges();

    expect(submitBtn.disabled).toBe(false);
  });
});
