import { AuthState } from "../interfaces/state-interfaces/auth-inter-st.model";

export const initialState: AuthState = {
  accessToken: null,
  email: null,
  role: null,
  error: null,
  loading: false,
} 