import {Component} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


export interface Course {
  name: string;
  category: 'adults' | 'children';  // Два типа категорий
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';  // Уровни CEFR
  rate: number;
  author: string;
}

export const COURSES_DATA: Course[] = [
  { 
    name: 'Английский для начинающих (A1-A2)', 
    category: 'adults', 
    level: 'A1',
    rate: 4.8, 
    author: 'Anna Johnson' 
  },
  { 
    name: 'Деловой английский для профессионалов', 
    category: 'adults', 
    level: 'B2',
    rate: 4.9, 
    author: 'Michael Brown' 
  },
  { 
    name: 'Подготовка к IELTS', 
    category: 'adults', 
    level: 'C1',
    rate: 4.7, 
    author: 'Sarah Wilson' 
  },
  { 
    name: 'Английский для IT-специалистов', 
    category: 'adults', 
    level: 'B1',
    rate: 4.6, 
    author: 'David Chen' 
  },
  { 
    name: 'Разговорный английский для путешествий', 
    category: 'adults', 
    level: 'A2',
    rate: 4.5, 
    author: 'Emma Taylor' 
  },
  { 
    name: 'Английская грамматика от А до Я', 
    category: 'adults', 
    level: 'B2',
    rate: 4.8, 
    author: 'Robert Smith' 
  },
  { 
    name: 'Английский для детей (7-12 лет)', 
    category: 'children', 
    level: 'A1',
    rate: 4.9, 
    author: 'Lisa Martinez' 
  },
  { 
    name: 'Веселый английский для малышей (3-6 лет)', 
    category: 'children', 
    level: 'A1',
    rate: 4.9, 
    author: 'Sophia Williams' 
  },
  { 
    name: 'Английский для подростков (13-17 лет)', 
    category: 'children', 
    level: 'A2',
    rate: 4.7, 
    author: 'James Anderson' 
  },
  { 
    name: 'Подготовка к ОГЭ по английскому', 
    category: 'children', 
    level: 'B1',
    rate: 4.6, 
    author: 'Elena Petrova' 
  },
  { 
    name: 'Медицинский английский', 
    category: 'adults', 
    level: 'C1',
    rate: 4.7, 
    author: 'Dr. Maria Garcia' 
  },
  { 
    name: 'Финансовый английский', 
    category: 'adults', 
    level: 'B2',
    rate: 4.6, 
    author: 'John Davis' 
  },
  { 
    name: 'Английский для юристов', 
    category: 'adults', 
    level: 'C1',
    rate: 4.8, 
    author: 'Thomas Wilson' 
  },
  { 
    name: 'Английский через песни и мультфильмы', 
    category: 'children', 
    level: 'A1',
    rate: 4.8, 
    author: 'Natalie Johnson' 
  },
  { 
    name: 'Английский для сдачи ЕГЭ', 
    category: 'children', 
    level: 'B2',
    rate: 4.7, 
    author: 'Ivan Smirnov' 
  }
];

@Component({
  selector: 'app-main-page',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {


  displayedColumns: string[] = ['category', 'name', 'rate', 'author', 'level'];
  dataSource = new MatTableDataSource(COURSES_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}