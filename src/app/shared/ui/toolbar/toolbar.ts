import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../services/auth.service';
import { LanguageSwitcherComponent } from '../../../components/language-switcher/language-switcher';

@Component({
  selector: 'app-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class ToolbarComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  userEmail = signal<string | null>(null);

  constructor() {
    this.userEmail.set(this.authService.getEmail());
  }

  goToAllCourses(): void {
    this.router.navigate(['/platform/list-of-courses']);
  }

  goToProfile(): void {
    this.router.navigate(['/platform/profile']);
  }
}
