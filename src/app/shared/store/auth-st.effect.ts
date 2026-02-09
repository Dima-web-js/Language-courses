import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthServiceSt } from "../services/auth-st.service";
import { Router } from "@angular/router";

import { 
  initFromStorage, 
  login, 
  logout, 
  loginSuccess, 
  loginFailure 
} from "./auth-st.actions";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { UserRole } from "../interfaces/state-interfaces/auth-inter-st.model";

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthServiceSt);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  initFromStorage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(initFromStorage),
    map(()=> {      
        if (!isPlatformBrowser(this.platformId)) {
          return loginFailure({ error: 'Not browser platform' });
        }
        
        const token = localStorage.getItem('accessToken');
        const email = localStorage.getItem('email');
        const userName = localStorage.getItem('userName');
        const role = localStorage.getItem('role');

        if (token && email && userName && role) {
          return loginSuccess({
            payload: {
              accessToken: token,
              email,
              userName,
              role: role as UserRole,
            }
          });
        }

        return loginFailure({ error: 'No saved session' });
   
      }
    )

  )
  
  )

  login$ = createEffect(() =>
  
    this.actions$.pipe(
      // фильтруем actions по типу (выбираем нужный)
      ofType(login),
      mergeMap((action) =>
      
        this.authService.login(action.payload).pipe(
          map((response) => 
          loginSuccess({payload: response})
          ),
          catchError((error)=>
            // of чтобы observable вернул
            of(loginFailure({error: error.message || 'Ошибка входа' }))
          )
        )

      )
    )
  )

  loginSuccess$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loginSuccess),
    tap((action)=> {
      if (!isPlatformBrowser(this.platformId)){
        return;
      }
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('userName', action.payload.userName);
      localStorage.setItem('role', action.payload.role);

      this.router.navigate(['/platform']);
    }

    )
  ),

  // Данный эффект не должен диспатчить новый action. не нужно, если вызываем новый action.
  {dispatch: false}
  )

  loginFailure$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loginFailure),
    tap((action) =>
      console.log('Ошибка: ', action.error)
    )
  ),
  // Данный эффект не должен диспатчить новый action. не нужно, если вызываем новый action.
  {dispatch: false}
  )


  logout$ = createEffect(() => 
  this.actions$.pipe(
    ofType(logout),
    tap(() =>
    {
      if (!isPlatformBrowser(this.platformId)){
        return;
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('email');
      localStorage.removeItem('userName');
      localStorage.removeItem('role');

      this.router.navigate(['/']);

    }
    
    )

  ),
  // Данный эффект не должен диспатчить новый action. не нужно, если вызываем новый action.
  {dispatch: false}
  )

}