// весь файл чисто для обучения

import { createAction, props } from "@ngrx/store";
import { LoginRequest, LoginResponse } from "../interfaces/state-interfaces/auth-inter-st.model";


export const initFromStorage = createAction(
  '[Auth Page] Init From Storage'
);

export const login = createAction(
  '[Auth Page] Login', 
  props<{payload: LoginRequest}>()
);


export const logout = createAction(
  '[Auth Page] Logout'
);

export const loginSuccess = createAction(
  '[Auth Page] Login Success',
  props<{payload: LoginResponse}>()
);

export const loginFailure = createAction(
  '[Auth Page] Login Failure',
  props<{error: string}>()
);

