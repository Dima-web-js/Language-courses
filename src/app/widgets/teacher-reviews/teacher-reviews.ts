import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-teacher-reviews',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-reviews.html',
  styleUrl: './teacher-reviews.scss',
})
export class TeacherReviews {
  readonly reviews = [
    { src: 'assets/img/Отзывы 1.png', alt: 'Отзыв ученика о занятиях английским языком' },
  ];
}
