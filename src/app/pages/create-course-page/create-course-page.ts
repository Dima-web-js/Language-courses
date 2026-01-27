import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-course-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './create-course-page.html',
  styleUrl: './create-course-page.scss',
})
export class CreateCoursePage {
  courseForm: FormGroup;

  categories = [
    { value: 'adults', label: 'Для взрослых' },
    { value: 'children', label: 'Для детей' },
  ];

  levels = [
    { value: 'A1', label: 'A1 (начальный)' },
    { value: 'A2', label: 'A2 (элементарный)' },
    { value: 'B1', label: 'B1 (средний)' },
    { value: 'B2', label: 'B2 (выше среднего)' },
    { value: 'C1', label: 'C1 (продвинутый)' },
    { value: 'C2', label: 'C2 (профессиональный)' },
  ];

  languages = [
    { value: 'Английский', label: 'Английский' },
    { value: 'Англ-рус', label: 'Англ-рус' },
  ];

  themes = [
    'Общий английский',
    'Деловой английский',
    'Подготовка к экзаменам',
    'Профессиональный английский',
    'Путешествия',
    'Грамматика',
    'Детский английский',
    'Подростковый английский',
    'Медицина',
    'Финансы',
    'Юриспруденция',
    'Развлечения и творчество',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      level: ['', Validators.required],
      theme: ['', Validators.required],
      language: ['', Validators.required],
      description: ['', Validators.required],
      goals: [''],
      program: [''],
      lessons: [''],
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Course data:', this.courseForm.value);
      alert('Курс успешно создан! (это демо-форма, данные не сохраняются)');
      this.router.navigate(['/list-of-courses']);
    }
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
