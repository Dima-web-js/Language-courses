import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input({ required: true }) themeOptions: string[] = [];
  @Input({ required: true }) languageOptions: string[] = [];

  @Input({ required: true }) selectedTheme!: () => string | null;
  @Input({ required: true }) selectedLevel!: () => Level | null;
  @Input({ required: true }) selectedLanguage!: () => string | null;

  @Output() searchChange = new EventEmitter<string>();
  @Output() themeChange = new EventEmitter<string>();
  @Output() levelChange = new EventEmitter<Level | null>();
  @Output() languageChange = new EventEmitter<string>();

  readonly levelOptions: Level[] = Object.values(LEVEL);

  onSearchKeyup(event: Event) {
    const v = ((event.target as HTMLInputElement).value ?? '').trim().toLowerCase();
    this.searchChange.emit(v);
  }
}
