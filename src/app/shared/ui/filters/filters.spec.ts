import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { Filters, ALL_FILTER_VALUE } from './filters';
import { LEVEL } from '../../interfaces/course.model';

@Injectable({ providedIn: 'root' })
class MockLoader implements TranslocoLoader {
  getTranslation() {
    return of({} as Record<string, string>);
  }
}

describe('Filters', () => {
  let component: Filters;
  let fixture: ComponentFixture<Filters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filters],
      providers: [
        provideHttpClient(),
        provideTransloco({
          config: { availableLangs: ['ru', 'en'], defaultLang: 'ru' },
          loader: MockLoader,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Filters);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('themeOptions', []);
    fixture.componentRef.setInput('languageOptions', []);
    fixture.componentRef.setInput('selectedTheme', ALL_FILTER_VALUE);
    fixture.componentRef.setInput('selectedLevel', ALL_FILTER_VALUE);
    fixture.componentRef.setInput('selectedLanguage', ALL_FILTER_VALUE);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allValue should equal ALL_FILTER_VALUE constant', () => {
    expect(component.allValue).toBe(ALL_FILTER_VALUE);
  });

  it('levelOptions should contain all CEFR levels', () => {
    const levels = Object.values(LEVEL);
    expect(component.levelOptions).toEqual(levels);
  });

  it('levelOptions should have 6 entries', () => {
    expect(component.levelOptions.length).toBe(6);
  });

  it('onSearchKeyup should emit trimmed lowercased value', () => {
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    const event = new Event('keyup');
    Object.defineProperty(event, 'target', {
      value: { value: '  Angular  ' },
    });
    component.onSearchKeyup(event);

    expect(spy).toHaveBeenCalledWith('angular');
  });

  it('onSearchKeyup should emit empty string for whitespace-only input', () => {
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    const event = new Event('keyup');
    Object.defineProperty(event, 'target', { value: { value: '   ' } });
    component.onSearchKeyup(event);

    expect(spy).toHaveBeenCalledWith('');
  });

  it('onSearchKeyup should emit empty string when target value is empty', () => {
    const spy = vi.fn();
    component.searchChange.subscribe(spy);

    const event = new Event('keyup');
    Object.defineProperty(event, 'target', { value: { value: '' } });
    component.onSearchKeyup(event);

    expect(spy).toHaveBeenCalledWith('');
  });

  it('themeOptions input should be reflected on component', () => {
    fixture.componentRef.setInput('themeOptions', ['Grammar', 'Business']);
    expect(component.themeOptions()).toEqual(['Grammar', 'Business']);
  });

  it('languageOptions input should be reflected on component', () => {
    fixture.componentRef.setInput('languageOptions', ['Английский', 'Англ-рус']);
    expect(component.languageOptions()).toEqual(['Английский', 'Англ-рус']);
  });

  it('selectedTheme input should be reflected on component', () => {
    fixture.componentRef.setInput('selectedTheme', 'Business');
    expect(component.selectedTheme()).toBe('Business');
  });

  it('template should render theme options when select is opened', async () => {
    fixture.componentRef.setInput('themeOptions', ['Grammar', 'Business']);
    fixture.componentRef.setInput('languageOptions', []);
    fixture.componentRef.setInput('selectedTheme', ALL_FILTER_VALUE);
    fixture.componentRef.setInput('selectedLevel', ALL_FILTER_VALUE);
    fixture.componentRef.setInput('selectedLanguage', ALL_FILTER_VALUE);
    fixture.detectChanges();

    // mat-option lives in the CDK overlay — must open the panel first
    const trigger: HTMLElement | null =
      fixture.nativeElement.querySelector('.mat-mdc-select-trigger');
    trigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // 1 "all themes" option + 2 provided themes = 3 total
    const options: NodeListOf<HTMLElement> = document.querySelectorAll('mat-option');
    const texts = Array.from(options).map(o => o.textContent?.trim() || '');
    expect(texts).toContain('Grammar');
    expect(texts).toContain('Business');
    expect(options.length).toBe(3);

    document.body.click();
    fixture.detectChanges();
  });
});
