import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoursesStore } from '../../shared/store/courses.store';

@Component({
  selector: 'app-course-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslocoModule,
  ],
  templateUrl: './course-page.html',
  styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly coursesStore = inject(CoursesStore);

  readonly lessonsDisplayedColumns: string[] = ['title', 'duration', 'progress'];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : NaN;
    if (!Number.isNaN(id)) {
      this.coursesStore.loadCourseById(id);
    }
  }

  openLesson(courseId: number, lessonId: number) {
    this.router.navigate(['/platform/course', courseId, 'lesson', lessonId]);
  }

  goBack() {
    this.router.navigate(['/platform/list-of-courses']);
  }
}
