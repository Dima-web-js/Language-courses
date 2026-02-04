export interface AuthState {
  accessToken: string | null;
  email: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}
