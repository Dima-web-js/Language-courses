import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseListItem, Level, LEVEL } from '../../shared/interfaces/course.model';
import { Router } from '@angular/router';
import { CoursesService } from '../../shared/services/courses.service';
import { ToolbarComponent } from '../../shared/ui/toolbar/toolbar';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-main-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslocoModule,
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage implements OnInit {
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);

  displayedColumns: string[] = ['category', 'name', 'rate', 'author'];
  dataSource = new MatTableDataSource<CourseListItem>([]);
  loading = signal(true);

  themeOptions: string[] = [];
  readonly levelOptions: Level[] = Object.values(LEVEL);
  readonly languageOptions: string[] = ['Английский', 'Англ-рус'];

  searchFilterText = '';
  selectedTheme: string | null = null;
  selectedLevel: Level | null = null;
  selectedLanguage: string | null = null;

  constructor() {
    this.dataSource.filterPredicate = (data: CourseListItem, filterStr: string) =>
      this.filterPredicate(data, filterStr);
  }

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.themeOptions = [...new Set(data.map((c) => c.theme))].sort();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilter(event: Event) {
    this.searchFilterText = ((event.target as HTMLInputElement).value ?? '').trim().toLowerCase();
    this.applyFilters();
  }

  onThemeChange(value: string) {
    this.selectedTheme = value || null;
    this.applyFilters();
  }

  onLevelChange(value: Level | '') {
    this.selectedLevel = (value || null) as Level | null;
    this.applyFilters();
  }

  onLanguageChange(value: string) {
    this.selectedLanguage = value || null;
    this.applyFilters();
  }

  private applyFilters() {
    this.dataSource.filter = JSON.stringify({
      search: this.searchFilterText,
      theme: this.selectedTheme,
      level: this.selectedLevel,
      language: this.selectedLanguage,
    });
  }

  openCourse(courseId: number) {
    this.router.navigate(['/platform/course', courseId]);
  }

  private filterPredicate(data: CourseListItem, filterStr: string): boolean {
    let f: { search: string; theme: string | null; level: string | null; language: string | null };
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