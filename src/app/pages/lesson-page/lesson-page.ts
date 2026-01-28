import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { LessonContent } from '../../shared/interfaces/course.model';
import { CoursesService } from '../../shared/services/courses.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lesson-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, TranslocoModule],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
})
export class LessonPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  lessonContent = signal<LessonContent | undefined>(undefined);
  safeVideoUrl = signal<SafeResourceUrl | undefined>(undefined);
  loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          const courseId = +(paramMap.get('courseId') ?? NaN);
          const lessonId = +(paramMap.get('lessonId') ?? NaN);
          if (Number.isNaN(courseId) || Number.isNaN(lessonId)) {
            return of(null);
          }
          this.loading.set(true);
          return this.coursesService.getLessonById(courseId, lessonId).pipe(
            map((content) => ({ content, courseId, lessonId }))
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (result) => {
          this.loading.set(false);
          if (!result) {
            this.lessonContent.set(undefined);
            this.safeVideoUrl.set(undefined);
            return;
          }
          this.lessonContent.set(result.content);
          const embedUrl = this.toEmbedUrl(result.content.videoUrl);
          this.safeVideoUrl.set(
            this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
          );
        },
        error: () => {
          this.loading.set(false);
          this.lessonContent.set(undefined);
          this.safeVideoUrl.set(undefined);
        },
      });
  }

  goBackToCourse() {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const id = courseIdParam ? +courseIdParam : NaN;
    if (!Number.isNaN(id)) {
      this.router.navigate(['/platform/course', id]);
    }
  }

  goToNextLesson() {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const nextId = this.lessonContent()?.nextLessonId;
    if (nextId == null || !courseIdParam) return;
    this.router.navigate(['/platform/course', +courseIdParam, 'lesson', nextId]);
  }

  goToPreviousLesson() {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const prevId = this.lessonContent()?.previousLessonId;
    if (prevId == null || !courseIdParam) return;
    this.router.navigate(['/platform/course', +courseIdParam, 'lesson', prevId]);
  }

  hasNextLesson(): boolean {
    return this.lessonContent()?.nextLessonId != null;
  }

  hasPreviousLesson(): boolean {
    return this.lessonContent()?.previousLessonId != null;
  }

  /** Преобразует ссылку на видео в URL для встраивания (iframe). */
  private toEmbedUrl(url: string): string {
    const trimmed = url.trim();
    // YouTube: watch?v=ID, youtu.be/ID, m.youtube.com/...
    const ytMatch =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|(?:m\.)?youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/i.exec(
        trimmed
      );
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Rutube: rutube.ru/video/ID/ или rutube.ru/play/embed/ID/
    const rtMatch = /rutube\.ru\/(?:video|play\/embed)\/([a-zA-Z0-9_-]+)/i.exec(
      trimmed
    );
    if (rtMatch) {
      return `https://rutube.ru/play/embed/${rtMatch[1]}/`;
    }
    return trimmed;
  }
}
