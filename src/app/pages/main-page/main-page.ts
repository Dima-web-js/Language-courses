import {Component} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { Course, Level, LEVEL } from '../../interfaces/course.model';
import { Router } from '@angular/router';



export const COURSES_DATA: Course[] = [
  {
    id: 1,
    name: 'Английский для начинающих (A1-A2)',
    category: 'adults',
    level: 'A1',
    rate: 4.8,
    author: 'Anna Johnson',
    theme: 'Общий английский',
    language: 'Английский',
    description:
      'Этот курс предназначен для тех, кто только начинает изучать английский язык. Вы научитесь основам грамматики, базовой лексике и сможете вести простые диалоги на английском языке.',
    goals: [
      'Освоить базовую грамматику и лексику',
      'Научиться представляться и вести простые диалоги',
      'Понимать простые тексты и инструкции',
      'Читать и писать короткие сообщения',
    ],
    program:
      'Курс состоит из 12 модулей, каждый из которых посвящен определенной теме: знакомство, семья, работа, путешествия и т.д. Каждый модуль включает видеоуроки, упражнения и тесты.',
    lessons: [
      {
        id: 1,
        title: 'Знакомство и приветствия',
        duration: 15,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 2,
        title: 'Алфавит и произношение',
        duration: 20,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 3,
        title: 'Числа и время',
        duration: 18,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 4,
        title: 'Семья и друзья',
        duration: 22,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 5,
        title: 'Еда и напитки',
        duration: 25,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
    ],
  },
  {
    id: 2,
    name: 'Деловой английский для профессионалов',
    category: 'adults',
    level: 'B2',
    rate: 4.9,
    author: 'Michael Brown',
    theme: 'Деловой английский',
    language: 'Англ-рус',
    description:
      'Курс для профессионалов, работающих в международных компаниях. Научитесь вести деловую переписку, проводить презентации и переговоры на английском языке.',
    goals: [
      'Вести деловую переписку',
      'Проводить презентации',
      'Участвовать в переговорах',
      'Понимать деловую документацию',
    ],
    program:
      'Курс охватывает темы: деловая переписка, телефонные переговоры, встречи и презентации, работа с документами.',
    lessons: [
      {
        id: 1,
        title: 'Деловая переписка: письма и email',
        duration: 25,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 2,
        title: 'Телефонные переговоры',
        duration: 20,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 3,
        title: 'Деловые встречи',
        duration: 30,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
    ],
  },
  {
    id: 3,
    name: 'Подготовка к IELTS',
    category: 'adults',
    level: 'C1',
    rate: 4.7,
    author: 'Sarah Wilson',
    theme: 'Подготовка к экзаменам',
    language: 'Англ-рус',
    description:
      'Интенсивный курс подготовки к экзамену IELTS. Разбор всех секций экзамена, стратегии выполнения заданий, практические упражнения.',
    goals: [
      'Понять структуру экзамена IELTS',
      'Освоить стратегии для каждой секции',
      'Повысить балл до 7.0+',
      'Научиться управлять временем на экзамене',
    ],
    program:
      'Курс включает разбор всех четырех модулей IELTS: Listening, Reading, Writing, Speaking. Множество практических заданий и пробных тестов.',
    lessons: [
      {
        id: 1,
        title: 'Введение в IELTS',
        duration: 15,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 2,
        title: 'Listening: стратегии и практика',
        duration: 35,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 3,
        title: 'Reading: типы вопросов',
        duration: 40,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 4,
        title: 'Writing Task 1',
        duration: 30,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
    ],
  },
  {
    id: 4,
    name: 'Английский для IT-специалистов',
    category: 'adults',
    level: 'B1',
    rate: 4.6,
    author: 'David Chen',
    theme: 'Профессиональный английский',
    language: 'Англ-рус',
    description:
      'Специализированный курс для IT-профессионалов. Изучите техническую лексику, научитесь описывать технические процессы и участвовать в код-ревью на английском.',
    goals: [
      'Освоить техническую лексику',
      'Читать техническую документацию',
      'Участвовать в код-ревью',
      'Общаться с международной командой',
    ],
    program: 'Курс охватывает техническую терминологию, написание документации, общение в команде.',
    lessons: [
      {
        id: 1,
        title: 'Техническая лексика',
        duration: 20,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
      {
        id: 2,
        title: 'Код-ревью на английском',
        duration: 25,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        progress: Math.floor(Math.random() * 101),
      },
    ],
  },
  {
    id: 5,
    name: 'Разговорный английский для путешествий',
    category: 'adults',
    level: 'A2',
    rate: 4.5,
    author: 'Emma Taylor',
    theme: 'Путешествия',
    language: 'Английский',
    description: 'Практический курс для путешественников. Научитесь общаться в аэропорту, отеле, ресторане и других туристических ситуациях.',
    goals: [
      'Общаться в аэропорту и отеле',
      'Заказывать еду в ресторане',
      'Спрашивать дорогу',
      'Решать бытовые вопросы в поездке',
    ],
    program: 'Курс включает темы: аэропорт, отель, ресторан, транспорт, достопримечательности.',
    lessons: [
      { id: 1, title: 'В аэропорту', duration: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'В отеле', duration: 18, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 6,
    name: 'Английская грамматика от А до Я',
    category: 'adults',
    level: 'B2',
    rate: 4.8,
    author: 'Robert Smith',
    theme: 'Грамматика',
    language: 'Английский',
    description: 'Полный курс английской грамматики для уровня B2. Систематизируйте знания и закройте пробелы.',
    goals: ['Систематизировать грамматические знания', 'Избавиться от типичных ошибок', 'Уверенно использовать все времена'],
    program: 'Курс охватывает все аспекты английской грамматики: времена, условные предложения, модальные глаголы и т.д.',
    lessons: [
      { id: 1, title: 'Система времен английского языка', duration: 30, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Условные предложения', duration: 25, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 7,
    name: 'Английский для детей (7-12 лет)',
    category: 'children',
    level: 'A1',
    rate: 4.9,
    author: 'Lisa Martinez',
    theme: 'Детский английский',
    language: 'Англ-рус',
    description: 'Увлекательный курс английского для детей младшего школьного возраста. Игровой формат обучения.',
    goals: ['Выучить базовую лексику', 'Научиться читать простые тексты', 'Понимать английскую речь'],
    program: 'Курс включает игры, песни, мультфильмы и интерактивные упражнения.',
    lessons: [
      { id: 1, title: 'Цвета и формы', duration: 12, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Животные', duration: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 8,
    name: 'Веселый английский для малышей (3-6 лет)',
    category: 'children',
    level: 'A1',
    rate: 4.9,
    author: 'Sophia Williams',
    theme: 'Детский английский',
    language: 'Англ-рус',
    description: 'Первое знакомство с английским языком для дошкольников через игры и мультфильмы.',
    goals: ['Познакомиться с английским языком', 'Выучить первые слова', 'Полюбить английский'],
    program: 'Короткие уроки с мультфильмами, песнями и играми.',
    lessons: [
      { id: 1, title: 'Приветствие', duration: 10, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Счет до 10', duration: 12, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 9,
    name: 'Английский для подростков (13-17 лет)',
    category: 'children',
    level: 'A2',
    rate: 4.7,
    author: 'James Anderson',
    theme: 'Подростковый английский',
    language: 'Английский',
    description: 'Современный английский для подростков с акцентом на разговорную речь и популярную культуру.',
    goals: ['Свободно общаться на бытовые темы', 'Понимать фильмы и сериалы', 'Общаться в соцсетях'],
    program: 'Курс основан на актуальных темах: соцсети, музыка, кино, путешествия.',
    lessons: [
      { id: 1, title: 'Общение в соцсетях', duration: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Обсуждение фильмов и сериалов', duration: 22, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 10,
    name: 'Подготовка к ОГЭ по английскому',
    category: 'children',
    level: 'B1',
    rate: 4.6,
    author: 'Elena Petrova',
    theme: 'Подготовка к экзаменам',
    language: 'Английский',
    description: 'Целенаправленная подготовка к ОГЭ по английскому языку. Разбор всех заданий и стратегии их выполнения.',
    goals: ['Понять структуру ОГЭ', 'Освоить стратегии выполнения заданий', 'Получить высокий балл'],
    program: 'Курс включает все разделы ОГЭ: аудирование, чтение, грамматика, письмо, говорение.',
    lessons: [
      { id: 1, title: 'Структура ОГЭ', duration: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Аудирование: стратегии', duration: 25, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 11,
    name: 'Медицинский английский',
    category: 'adults',
    level: 'C1',
    rate: 4.7,
    author: 'Dr. Maria Garcia',
    theme: 'Медицина',
    language: 'Англ-рус',
    description: 'Специализированный курс для медицинских работников. Медицинская терминология и профессиональное общение.',
    goals: ['Освоить медицинскую терминологию', 'Общаться с англоговорящими пациентами', 'Читать медицинскую литературу'],
    program: 'Курс включает анатомию, симптомы, диагностику, лечение.',
    lessons: [
      { id: 1, title: 'Медицинская терминология', duration: 30, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Общение с пациентами', duration: 25, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 12,
    name: 'Финансовый английский',
    category: 'adults',
    level: 'B2',
    rate: 4.6,
    author: 'John Davis',
    theme: 'Финансы',
    language: 'Англ-рус',
    description: 'Английский язык для работников финансовой сферы. Финансовая терминология и деловое общение.',
    goals: ['Освоить финансовую терминологию', 'Читать финансовые отчеты', 'Участвовать в финансовых переговорах'],
    program: 'Курс охватывает банковское дело, инвестиции, бухгалтерию.',
    lessons: [
      { id: 1, title: 'Финансовая терминология', duration: 25, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Финансовые отчеты', duration: 30, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 13,
    name: 'Английский для юристов',
    category: 'adults',
    level: 'C1',
    rate: 4.8,
    author: 'Thomas Wilson',
    theme: 'Юриспруденция',
    language: 'Англ-рус',
    description: 'Юридический английский для практикующих юристов. Изучение правовой терминологии и работа с документами.',
    goals: ['Освоить юридическую терминологию', 'Читать юридические документы', 'Участвовать в переговорах'],
    program: 'Курс включает контракты, судопроизводство, международное право.',
    lessons: [
      { id: 1, title: 'Юридическая терминология', duration: 30, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Работа с контрактами', duration: 35, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 14,
    name: 'Английский через песни и мультфильмы',
    category: 'children',
    level: 'A1',
    rate: 4.8,
    author: 'Natalie Johnson',
    theme: 'Развлечения и творчество',
    language: 'Англ-рус',
    description: 'Изучение английского через любимые песни и мультфильмы. Весело и эффективно!',
    goals: ['Полюбить английский', 'Выучить новые слова через песни', 'Понимать мультфильмы'],
    program: 'Каждый урок посвящен одной песне или мультфильму.',
    lessons: [
      { id: 1, title: 'Песня: ABC Song', duration: 10, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Мультфильм: Peppa Pig', duration: 15, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
  {
    id: 15,
    name: 'Английский для сдачи ЕГЭ',
    category: 'children',
    level: 'B2',
    rate: 4.7,
    author: 'Ivan Smirnov',
    theme: 'Подготовка к экзаменам',
    language: 'Английский',
    description: 'Интенсивная подготовка к ЕГЭ по английскому языку. Полный разбор всех заданий.',
    goals: ['Понять структуру ЕГЭ', 'Освоить стратегии выполнения заданий', 'Получить 90+ баллов'],
    program: 'Курс включает все разделы ЕГЭ: аудирование, чтение, грамматика, письмо, говорение.',
    lessons: [
      { id: 1, title: 'Структура ЕГЭ', duration: 20, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
      { id: 2, title: 'Письменная часть', duration: 35, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', progress: Math.floor(Math.random() * 101) },
    ],
  },
];

@Component({
  selector: 'app-main-page',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSelectModule, MatButtonModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  displayedColumns: string[] = ['category', 'name', 'rate', 'author'];
  dataSource = new MatTableDataSource(COURSES_DATA);

  readonly themeOptions = [...new Set(COURSES_DATA.map((c) => c.theme))].sort();
  readonly levelOptions: Level[] = Object.values(LEVEL);
  readonly languageOptions: string[] = ['Английский', 'Англ-рус'];

  searchFilterText = '';
  selectedTheme: string | null = null;
  selectedLevel: Level | null = null;
  selectedLanguage: string | null = null;

  constructor(private router: Router) {
    this.dataSource.filterPredicate = (data: Course, filterStr: string) =>
      this.filterPredicate(data, filterStr);
  }

  applyFilter(event: Event) {
    this.searchFilterText = ((event.target as HTMLInputElement).value ?? '').trim().toLowerCase();
    this.applyFilters();
  }

  onThemeChange(value: string) {
    this.selectedTheme = value || null;
    this.applyFilters();
  }

  onLevelChange(value: Level | '') {
    this.selectedLevel = (value || null) as Level | null;
    this.applyFilters();
  }

  onLanguageChange(value: string) {
    this.selectedLanguage = value || null;
    this.applyFilters();
  }

  private applyFilters() {
    this.dataSource.filter = JSON.stringify({
      search: this.searchFilterText,
      theme: this.selectedTheme,
      level: this.selectedLevel,
      language: this.selectedLanguage,
    });
  }

  openCourse(courseId: number) {
    this.router.navigate(['/course', courseId]);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  private filterPredicate(data: Course, filterStr: string): boolean {
    let f: { search: string; theme: string | null; level: string | null; language: string | null };
    try {
      f = JSON.parse(filterStr || '{}');
    } catch {
      return true;
    }
    if (f.search) {
      const search = f.search.toLowerCase();
      const match =
        data.name.toLowerCase().includes(search) ||
        data.author.toLowerCase().includes(search) ||
        data.category.toLowerCase().includes(search) ||
        data.theme.toLowerCase().includes(search) ||
        data.language.toLowerCase().includes(search) ||
        data.level.toLowerCase().includes(search) ||
        String(data.rate).includes(search);
      if (!match) return false;
    }
    if (f.theme && data.theme !== f.theme) return false;
    if (f.level && data.level !== f.level) return false;
    if (f.language && data.language !== f.language) return false;
    return true;
  }
}