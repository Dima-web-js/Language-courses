import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../interfaces/course.model';
import { Lesson } from '../../interfaces/lesson.model';
import { CoursesService } from '../../services/courses.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lesson-page',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
})
export class LessonPage implements OnInit {
  course = signal<Course | undefined>(undefined);
  lesson = signal<Lesson | undefined>(undefined);
  safeVideoUrl = signal<SafeResourceUrl | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    const lessonId = Number(this.route.snapshot.paramMap.get('lessonId'));

    const foundCourse = this.coursesService.getCourseById(courseId);
    this.course.set(foundCourse);

    if (foundCourse) {
      const foundLesson = foundCourse.lessons.find((l) => l.id === lessonId);
      this.lesson.set(foundLesson);

      if (foundLesson) {
        this.safeVideoUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(foundLesson.videoUrl)
        );
      }
    }
  }

  goBackToCourse() {
    const courseId = this.course()?.id;
    if (courseId) {
      this.router.navigate(['/course', courseId]);
    }
  }

  goToNextLesson() {
    const currentCourse = this.course();
    const currentLesson = this.lesson();

    if (!currentCourse || !currentLesson) return;

    const currentIndex = currentCourse.lessons.findIndex(
      (l) => l.id === currentLesson.id
    );
    if (currentIndex < currentCourse.lessons.length - 1) {
      const nextLesson = currentCourse.lessons[currentIndex + 1];
      this.router.navigate(['/course', currentCourse.id, 'lesson', nextLesson.id]);
    }
  }

  hasNextLesson(): boolean {
    const currentCourse = this.course();
    const currentLesson = this.lesson();

    if (!currentCourse || !currentLesson) return false;

    const currentIndex = currentCourse.lessons.findIndex(
      (l) => l.id === currentLesson.id
    );
    return currentIndex < currentCourse.lessons.length - 1;
  }
}
