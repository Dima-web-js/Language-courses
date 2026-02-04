import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { ProfileStore } from '../../shared/store/profile.store';
import { AuthStore } from '../../shared/store/auth.store';

@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslocoModule,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage implements OnInit {
  private readonly router = inject(Router);
  readonly profileStore = inject(ProfileStore);
  readonly authStore = inject(AuthStore);
  private readonly transloco = inject(TranslocoService);

  readonly roleLabel = computed(() => {
    const profile = this.profileStore.profile();
    if (!profile) return '';
    const key = profile.role === 'teacher' ? 'Преподаватель' : 'Ученик';
    return this.transloco.translate(key);
  });

  ngOnInit(): void {
    this.profileStore.loadProfile();
  }

  goToCreateCourse() {
    this.router.navigate(['/platform/create-course']);
  }

  logout(): void {
    this.authStore.logout();
    this.profileStore.clearProfile();
  }
}
