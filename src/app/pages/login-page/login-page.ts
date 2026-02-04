import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  effect,
} from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@jsverse/transloco';
import { LoginFormData } from '../../shared/interfaces/login-form.model';
import { AuthStore } from '../../shared/store/auth.store';


@Component({
  selector: 'app-login-page',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslocoModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly authStore = inject(AuthStore);

  readonly loginModel = signal<LoginFormData>({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email обязателен' });
    email(schemaPath.email, { message: 'Введите корректный email' });
    required(schemaPath.password, { message: 'Пароль обязателен' });
  });

  readonly passwordVisible = signal(false);

  constructor() {
    // Следим за ошибками из store
    effect(() => {
      const error = this.authStore.error();
      if (error) {
        // Очищаем ошибку через некоторое время
        setTimeout(() => this.authStore.clearError(), 5000);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  clearErrorOnFieldTouch(): void {
    this.authStore.clearError();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.authStore.clearError();
    this.authStore.login(this.loginModel());
  }
}
