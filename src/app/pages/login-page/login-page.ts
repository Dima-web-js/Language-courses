import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { form, FormField, required, email } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../shared/services/auth.service';

interface LoginFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-page',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly loginModel = signal<LoginFormData>({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email обязателен' });
    email(schemaPath.email, { message: 'Введите корректный email' });
    required(schemaPath.password, { message: 'Пароль обязателен' });
  });

  readonly errorMessage = signal<string | null>(null);
  readonly loading = signal(false);
  readonly passwordVisible = signal(false);

  togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  clearErrorOnFieldTouch(): void {
    this.errorMessage.set(null);
  }

  onSubmit(event: Event): void {
    // тут нужно, иначе форма будет перезагружаться. в реактивных и template-driv формах работало автоматически
    // для этого же выше входной ивент и в шаблоне ивент
    event.preventDefault();
    this.errorMessage.set(null);
    
    this.loading.set(true);
    this.authService
      .login(this.loginModel())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/platform/list-of-courses']),
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.errorMessage.set('Неверный email или пароль');
          } else {
            this.errorMessage.set('Ошибка при входе. Попробуйте позже.');
          }
        },
      });
  }
}
