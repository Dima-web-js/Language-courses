import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { Level, LEVEL } from '../../interfaces/course.model';

@Component({
  selector: 'app-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, TranslocoModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
  host: {
    ngSkipHydration: 'true',
  },
})
export class Filters {
  themeOptions = input.required<string[]>();
  languageOptions = input.required<string[]>();

  selectedTheme = input.required<() => string | null>();
  selectedLevel = input.required<() => Level | null>();
  selectedLanguage = input.required<() => string | null>();

  searchChange = output<string>();
  themeChange = output<string>();
  levelChange = output<Level | null>();
  languageChange = output<string>();

  readonly levelOptions: Level[] = Object.values(LEVEL);

  onSearchKeyup(event: Event) {
    const v = ((event.target as HTMLInputElement).value ?? '').trim().toLowerCase();
    this.searchChange.emit(v);
  }
}
