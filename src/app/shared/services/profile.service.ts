import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileModel } from '../interfaces/profile.model';

@Injectable({
  providedIn: 'root',
})
export class Profile {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);


  getProfile(): Observable<ProfileModel> {
    return this.http.get<ProfileModel>(`${this.baseUrl}/auth/profile`);
  }
  
}
