import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl =  environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse>{
    const body = { username, password };
    const loginUrl = `${this.apiUrl}/auth/login`

    return this.http.post<LoginResponse>(loginUrl, body);
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('auth_token');
  }
}
