import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../shared/interfaces/course.model';
import { CoursesService } from '../../shared/services/courses.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  ],
  templateUrl: './course-page.html',
  styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);

  course = signal<Course | undefined>(undefined);
  loading = signal(true);
  readonly lessonsDisplayedColumns: string[] = ['title', 'duration', 'progress'];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : NaN;
    if (Number.isNaN(id)) {
      this.course.set(undefined);
      this.loading.set(false);
      return;
    }
    this.coursesService.getCourseById(id).subscribe({
      next: (data) => {
        this.course.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.course.set(undefined);
        this.loading.set(false);
      },
    });
  }

  openLesson(courseId: number, lessonId: number) {
    this.router.navigate(['/platform/course', courseId, 'lesson', lessonId]);
  }

  goBack() {
    this.router.navigate(['/platform/list-of-courses']);
  }
}
