import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../models/login-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) this.currentUser.set(JSON.parse(storedUser));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = { username, password };
    const loginUrl = `${this.apiUrl}/auth/login`

    return this.http.post<LoginResponse>(loginUrl, body).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  register(username: string, password: string, email: string): Observable<any> {
    const body = { username, password, email };
    const registerUrl = `${this.apiUrl}/auth/register`;
    return this.http.post(registerUrl, body);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.currentUser.set(null);
  }
}
