import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

interface UserProfile {
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

@Component({
  selector: 'app-profile-page',
  imports: [MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  // Хардкодим роль учителя
  profile = signal<UserProfile>({
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    role: 'teacher',
  });

  constructor(private router: Router) {}

  goToCreateCourse() {
    this.router.navigate(['/create-course']);
  }

  getRoleLabel(): string {
    return this.profile().role === 'teacher' ? 'Преподаватель' : 'Ученик';
  }
}
