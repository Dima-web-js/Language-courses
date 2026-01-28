export const LEVEL = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
} as const;

export type Level = (typeof LEVEL)[keyof typeof LEVEL];

export interface Lesson {
  id: number;
  title: string;
  duration: number;
  videoUrl: string;
  progress?: number;
  previousLessonId: number | null;
  nextLessonId: number | null;
}

/** Краткий контент урока (для детального запроса) */
export type LessonContent = Pick<Lesson, 'id' | 'videoUrl' | 'previousLessonId' | 'nextLessonId' | 'title'>;

/** Поля курса для списка (карточка) */
export interface CourseListItem {
  id: number;
  name: string;
  category: 'adults' | 'children';
  level: Level;
  rate: number;
  author: string;
  theme: string;
  language: string;
}

/** Полный курс с описанием и уроками (страница курса) */
export interface Course extends CourseListItem {
  description: string;
  goals: string[];
  program: string;
  lessons: Lesson[];
}