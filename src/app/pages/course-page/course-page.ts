import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../interfaces/course.model';
import { CoursesService } from '../../services/courses.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-course-page',
  imports: [
    MatCardModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './course-page.html',
  styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit {
  course = signal<Course | undefined>(undefined);
  readonly lessonsDisplayedColumns: string[] = ['title', 'duration', 'progress'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    const foundCourse = this.coursesService.getCourseById(courseId);
    this.course.set(foundCourse);
  }

  openLesson(courseId: number, lessonId: number) {
    this.router.navigate(['/course', courseId, 'lesson', lessonId]);
  }

  goBack() {
    this.router.navigate(['/list-of-courses']);
  }
}
