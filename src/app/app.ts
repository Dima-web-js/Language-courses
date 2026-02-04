import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './shared/store/auth.store';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly authStore = inject(AuthStore);
  protected readonly title = signal('language-courses');

  constructor() {
    // Инициализация auth store из localStorage
    this.authStore.initFromStorage();
  }
}
