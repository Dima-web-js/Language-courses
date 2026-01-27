import { Lesson } from './lesson.model';

export const LEVEL = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
} as const;

export type Level = (typeof LEVEL)[keyof typeof LEVEL];

export interface Course {
  id: number;
  name: string;
  category: 'adults' | 'children';
  level: Level;
  rate: number;
  author: string;
  theme: string;
  language: string;
  description: string;
  goals: string[];
  program: string;
  lessons: Lesson[];
}