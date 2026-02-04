import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CoursesStore } from '../../shared/store/courses.store';

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
  readonly coursesStore = inject(CoursesStore);
  private readonly sanitizer = inject(DomSanitizer);

  readonly courseId = signal<number | null>(null);
  readonly lessonId = signal<number | null>(null);

  readonly safeVideoUrl = computed(() => {
    const lesson = this.coursesStore.currentLesson();
    if (!lesson) return undefined;
    const embedUrl = this.toEmbedUrl(lesson.videoUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  });

  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const lessonIdParam = this.route.snapshot.paramMap.get('lessonId');
    const courseId = courseIdParam ? +courseIdParam : NaN;
    const lessonId = lessonIdParam ? +lessonIdParam : NaN;

    if (!Number.isNaN(courseId) && !Number.isNaN(lessonId)) {
      this.courseId.set(courseId);
      this.lessonId.set(lessonId);
      this.coursesStore.loadLesson({ courseId, lessonId });
    }
  }

  goBackToCourse() {
    const id = this.courseId();
    if (id != null) {
      this.router.navigate(['/platform/course', id]);
    }
  }

  goToNextLesson() {
    const courseId = this.courseId();
    const nextId = this.coursesStore.currentLesson()?.nextLessonId;
    if (nextId != null && courseId != null) {
      this.router.navigate(['/platform/course', courseId, 'lesson', nextId]);
    }
  }

  goToPreviousLesson() {
    const courseId = this.courseId();
    const prevId = this.coursesStore.currentLesson()?.previousLessonId;
    if (prevId != null && courseId != null) {
      this.router.navigate(['/platform/course', courseId, 'lesson', prevId]);
    }
  }

  hasNextLesson(): boolean {
    return this.coursesStore.currentLesson()?.nextLessonId != null;
  }

  hasPreviousLesson(): boolean {
    return this.coursesStore.currentLesson()?.previousLessonId != null;
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
