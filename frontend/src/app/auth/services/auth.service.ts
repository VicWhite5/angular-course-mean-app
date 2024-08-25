import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environments';
import { AuthStatus, LoginResponse, RegisterResponse, User } from '../interfaces';
import { CheckTokenResponse } from '../interfaces/check-token-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.apiBaseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.cheking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ data }) => {
        const { user, token } = data;

        return this.setAuthentication(user, token);
      }),
      catchError((error) => {
        return throwError(() => error.error.message);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/register`;
    const body = { name, email, password };

    return this.http.post<RegisterResponse>(url, body).pipe(
      map(({ data }) => {
        const { user, token } = data;

        return this.setAuthentication(user, token);
      }),
      catchError((error) => {
        return throwError(() => error.error.message);
      })
    );
  }

  logout(): void {
    
    localStorage.removeItem('token');

    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

  checkAuthStatus(): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/check-token`;

    const token = localStorage.getItem('token');

    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ data }) => {
        const { user, token } = data;
        return this.setAuthentication(user, token);
      }),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }
}
