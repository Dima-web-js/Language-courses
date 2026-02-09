import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { LoginRequest, LoginResponse } from "../interfaces/state-interfaces/auth-inter-st.model";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment.dev";
import { Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";


@Injectable({
  providedIn: 'root',
})
export class AuthServiceSt {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  apiUrl = environment.apiUrl + 'User/auth'

  login(body: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.apiUrl, body).pipe(
      tap((body) => 
        this.saveResponse(body),
    )
      
    )
    
  }

  saveResponse(body: LoginResponse): void {
    if (!isPlatformBrowser(this.platformId)){
      return;
    }
    localStorage.setItem('accessToken', body.accessToken);
    localStorage.setItem('email', body.email);
    localStorage.setItem('userName', body.userName);
    localStorage.setItem('role', body.role);
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
    
  }

}