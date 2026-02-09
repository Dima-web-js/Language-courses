// весь файл чисто для обучения
import { createReducer, on } from "@ngrx/store";
import { initialState } from "./auth-st-classic.state";

import { 
  initFromStorage, 
  login, 
  logout, 
  loginSuccess, 
  loginFailure 
} from "./auth-st.actions";

export const authReducer = createReducer(
  initialState,

  on(initFromStorage, (state) =>
  ({
    ...state,
    loading: true
  })
  ),

  on(login, (state) =>
    ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(loginSuccess, (state, {payload} ) =>
    ({
      ...state,
      accessToken: payload.accessToken,
      userName: payload.userName,
      email: payload.email,
      role: payload.role,
      loading: false,
      error: null
    })
  ),

  on(loginFailure, (state, {error}) =>
    ({
      ...state,
      loading: false,
      error: error
    })
  ),

  on(logout, () =>
  (
    {
      ...initialState
    }
  )
  
  )
);