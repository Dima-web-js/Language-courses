// чисто для обучения

export const UserRole = {
  Teacher: 'Teacher',
  Student: 'Student',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  email: string;
  password: string;
}

export interface LoginRequest extends User {
}

export interface LoginResponse {
  accessToken: string;
  userName: string;
  email: string;
  role: UserRole;
}

export interface AuthState{
  accessToken: string | null;
  email: string | null;
  role: UserRole | null;
  error: string | null;
  loading: boolean;

}