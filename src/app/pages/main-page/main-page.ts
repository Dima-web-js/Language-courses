import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseListItem } from '../../shared/interfaces/course.model';
import { Router } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { TranslocoModule } from '@jsverse/transloco';
import { ALL_FILTER_VALUE, Filters } from '../../shared/ui/filters/filters';

@Component({
  selector: 'app-main-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    TranslocoModule,
    Filters,
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage implements OnInit {
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['category', 'name', 'rate', 'author'];
  dataSource = new MatTableDataSource<CourseListItem>([]);
  loading = signal(true);

  themeOptions: string[] = [];
  readonly languageOptions: string[] = ['Английский', 'Англ-рус'];

  searchFilterText = '';

  selectedTheme = signal<string>(ALL_FILTER_VALUE);
  selectedLevel = signal<string>(ALL_FILTER_VALUE);
  selectedLanguage = signal<string>(ALL_FILTER_VALUE);

  constructor() {
    this.dataSource.filterPredicate = (data: CourseListItem, filterStr: string) =>
      this.filterPredicate(data, filterStr);
  }

  ngOnInit(): void {
    this.coursesService.getCourses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.themeOptions = [...new Set(data.map((c) => c.theme))].sort();
        this.loading.set(false);
        this.applyFilters();
      },
      error: () => this.loading.set(false),
    });
  }

  onSearchChange(v: string) {
    this.searchFilterText = v;
    this.applyFilters();
  }

  onThemeChange(value: string) {
    this.selectedTheme.set(value || ALL_FILTER_VALUE);
    this.applyFilters();
  }

  onLevelChange(value: string) {
    this.selectedLevel.set(value || ALL_FILTER_VALUE);
    this.applyFilters();
  }

  onLanguageChange(value: string) {
    this.selectedLanguage.set(value || ALL_FILTER_VALUE);
    this.applyFilters();
  }

  private applyFilters() {
    this.dataSource.filter = JSON.stringify({
      search: this.searchFilterText,
      theme: this.selectedTheme() === ALL_FILTER_VALUE ? '' : this.selectedTheme(),
      level: this.selectedLevel() === ALL_FILTER_VALUE ? '' : this.selectedLevel(),
      language: this.selectedLanguage() === ALL_FILTER_VALUE ? '' : this.selectedLanguage(),
    });
  }

  openCourse(courseId: number) {
    this.router.navigate(['/platform/course', courseId]);
  }

  private filterPredicate(data: CourseListItem, filterStr: string): boolean {
    let f: { search: string; theme: string; level: string; language: string };
    try {
      f = JSON.parse(filterStr || '{}');
    } catch {
      return true;
    }

    if (f.search) {
      const search = f.search.toLowerCase();
      const match =
        data.name.toLowerCase().includes(search) ||
        data.author.toLowerCase().includes(search) ||
        data.category.toLowerCase().includes(search) ||
        data.theme.toLowerCase().includes(search) ||
        data.language.toLowerCase().includes(search) ||
        data.level.toLowerCase().includes(search) ||
        String(data.rate).includes(search);
      if (!match) return false;
    }

    if (f.theme && data.theme !== f.theme) return false;
    if (f.level && data.level !== f.level) return false;
    if (f.language && data.language !== f.language) return false;

    return true;
  }
}