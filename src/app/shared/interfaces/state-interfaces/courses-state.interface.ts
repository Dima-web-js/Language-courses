import { Course, CourseListItem, LessonContent } from '../course.model';

export interface CoursesState {
  courses: CourseListItem[];
  currentCourse: Course | null;
  currentLesson: LessonContent | null;
  loading: boolean;
  error: string | null;
}
