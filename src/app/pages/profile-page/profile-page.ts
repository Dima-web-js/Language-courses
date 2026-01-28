import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ProfileModel } from '../../shared/interfaces/profile.model';
import { Profile } from '../../shared/services/profile.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage implements OnInit {
  private readonly router = inject(Router);
  private readonly profileService = inject(Profile);
  private readonly authService = inject(AuthService);

  profile = signal<ProfileModel | undefined>(undefined);
  loading = signal(true);

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.profile.set(undefined);
        this.loading.set(false);
      },
    });
  }

  goToCreateCourse() {
    this.router.navigate(['/platform/create-course']);
  }

  getRoleLabel(): string {
    const profileData = this.profile();
    if (!profileData) return '';
    return profileData.role === 'teacher' ? 'Преподаватель' : 'Ученик';
  }

  logout(): void {
    this.authService.logout();
  }
}
