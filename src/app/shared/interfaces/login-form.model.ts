export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  access_token: string;
  email: string;
  role: string;
}