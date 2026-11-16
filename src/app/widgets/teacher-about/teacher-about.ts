import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'app-teacher-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-about.html',
  styleUrl: './teacher-about.scss',
})
export class TeacherAbout {
  readonly photos = [
    { src: 'assets/img/Paris%20Eifil%20tower.jpg', alt: 'Дмитрий Кожухов на фоне Эйфелевой башни в Париже' },
    { src: 'assets/img/Cuba.jpg', alt: 'Дмитрий Кожухов рядом с ретроавтомобилем на Кубе' },
    { src: 'assets/img/Dubai.jpg', alt: 'Дмитрий Кожухов у воды на фоне небоскрёбов Дубая' },
    { src: 'assets/img/CAE.png', alt: 'Сертификат Cambridge English: Advanced (CAE)' },
  ];
}
