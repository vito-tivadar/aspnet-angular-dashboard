import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendEmailConfirmationRequest,
  ConfirmEmailChangeRequest,
  LoginWith2faRequest,
  LoginWithRecoveryCodeRequest,
} from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, request, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (!response.requiresTwoFactor) {
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  register(request: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  confirmEmail(request: ConfirmEmailRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/confirm-email`, request);
  }

  confirmEmailChange(request: ConfirmEmailChangeRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/confirm-email-change`, request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/reset-password`, request);
  }

  resendEmailConfirmation(request: ResendEmailConfirmationRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/resend-email-confirmation`, request);
  }

  loginWith2fa(request: LoginWith2faRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login-with-2fa`, request, { withCredentials: true })
      .pipe(
        tap(() => this.isAuthenticatedSubject.next(true))
      );
  }

  loginWithRecoveryCode(request: LoginWithRecoveryCodeRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login-with-recovery-code`, request, { withCredentials: true })
      .pipe(
        tap(() => this.isAuthenticatedSubject.next(true))
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.isAuthenticatedSubject.next(false),
      error: () => this.isAuthenticatedSubject.next(false),
    });
  }

  checkAuthStatus(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/account/profile`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false)),
      tap((isAuthenticated) => this.isAuthenticatedSubject.next(isAuthenticated))
    );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
