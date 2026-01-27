export interface Lesson {
  id: number;
  title: string;
  duration: number; // в минутах
  videoUrl: string;
  progress?: number; // процент прохождения (0-100)
}
