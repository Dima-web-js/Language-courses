# NgRx Signals Stores

Централизованное управление состоянием приложения с помощью NgRx Signals.

## Структура

### 1. AuthStore (`auth.store.ts`)

Управляет состоянием аутентификации пользователя.

**Состояние:**
- `accessToken`: токен доступа
- `email`: email пользователя
- `role`: роль пользователя (student/teacher)
- `loading`: состояние загрузки
- `error`: сообщение об ошибке

**Computed:**
- `isAuthenticated()`: проверка, авторизован ли пользователь

**Методы:**
- `initFromStorage()`: инициализация store из localStorage (вызывается при запуске приложения)
- `login(credentials)`: вход в систему (rxMethod)
- `logout()`: выход из системы
- `clearError()`: очистка ошибок

**Использование:**
```typescript
// В компоненте
readonly authStore = inject(AuthStore);

// Чтение состояния
if (authStore.isAuthenticated()) { ... }
const email = authStore.email();
const isLoading = authStore.loading();

// Действия
authStore.login({ email: '...', password: '...' });
authStore.logout();
```

### 2. CoursesStore (`courses.store.ts`)

Управляет состоянием курсов и уроков.

**Состояние:**
- `courses`: список всех курсов
- `currentCourse`: текущий открытый курс
- `currentLesson`: текущий открытый урок
- `loading`: состояние загрузки
- `error`: сообщение об ошибке

**Методы:**
- `loadCourses()`: загрузка списка курсов (rxMethod)
- `loadCourseById(id)`: загрузка курса по ID (rxMethod)
- `loadLesson({ courseId, lessonId })`: загрузка урока (rxMethod)
- `clearCurrentCourse()`: очистка текущего курса
- `clearCurrentLesson()`: очистка текущего урока
- `clearError()`: очистка ошибок

**Использование:**
```typescript
// В компоненте
readonly coursesStore = inject(CoursesStore);

// Загрузка данных
coursesStore.loadCourses();
coursesStore.loadCourseById(1);
coursesStore.loadLesson({ courseId: 1, lessonId: 5 });

// Чтение состояния
const courses = coursesStore.courses();
const currentCourse = coursesStore.currentCourse();
const isLoading = coursesStore.loading();
```

### 3. ProfileStore (`profile.store.ts`)

Управляет состоянием профиля пользователя.

**Состояние:**
- `profile`: данные профиля пользователя
- `loading`: состояние загрузки
- `error`: сообщение об ошибке

**Методы:**
- `loadProfile()`: загрузка профиля (rxMethod)
- `clearProfile()`: очистка профиля
- `clearError()`: очистка ошибок

**Использование:**
```typescript
// В компоненте
readonly profileStore = inject(ProfileStore);

// Загрузка данных
profileStore.loadProfile();

// Чтение состояния
const profile = profileStore.profile();
const isLoading = profileStore.loading();

// Очистка при выходе
profileStore.clearProfile();
```

## Инициализация

AuthStore инициализируется в корневом компоненте (`app.ts`):

```typescript
constructor() {
  // Восстановление сессии из localStorage
  this.authStore.initFromStorage();
}
```

## Преимущества использования NgRx Signals

1. **Реактивность**: автоматическое обновление UI при изменении состояния
2. **Централизация**: единое место для управления состоянием
3. **Типобезопасность**: полная поддержка TypeScript
4. **Производительность**: использование Angular signals для оптимальной производительности
5. **Простота**: меньше boilerplate кода по сравнению с классическим NgRx

## Миграция с сервисов

Компоненты были обновлены для использования stores:

- `login-page` → использует `AuthStore`
- `main-page` → использует `CoursesStore`
- `course-page` → использует `CoursesStore`
- `lesson-page` → использует `CoursesStore`
- `profile-page` → использует `ProfileStore` и `AuthStore`
- `toolbar` → использует `AuthStore`
- `auth.guard` → использует `AuthStore`

Старые сервисы (`AuthService`, `CoursesService`, `Profile`) теперь используются **только внутри stores** и не вызываются напрямую из компонентов.
