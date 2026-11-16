import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-teacher-contacts',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-contacts.html',
  styleUrl: './teacher-contacts.scss',
})
export class TeacherContacts {
  readonly instagram = '@knightdima2939';
  readonly telegram = '@dimaknight99';
  readonly emails = ['kozhuhovdmitry@yandex.ru', 'dimakozhukhov1939@gmail.com'];
}
