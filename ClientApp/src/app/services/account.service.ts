import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  SetPasswordRequest,
  ChangeEmailRequest,
  EmailInfo,
  DeletePersonalDataRequest,
  TwoFactorStatus,
  AuthenticatorSetup,
  Enable2faRequest,
  ExternalLoginsInfo,
  RemoveExternalLoginRequest,
} from '../models/auth.models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly apiUrl = `${environment.apiUrl}/account`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  updateProfile(request: UpdateProfileRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/profile`, request);
  }

  changePassword(request: ChangePasswordRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/change-password`, request);
  }

  setPassword(request: SetPasswordRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/set-password`, request);
  }

  getEmail(): Observable<EmailInfo> {
    return this.http.get<EmailInfo>(`${this.apiUrl}/email`);
  }

  changeEmail(request: ChangeEmailRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/change-email`, request);
  }

  deletePersonalData(request: DeletePersonalDataRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/delete-personal-data`, request);
  }

  downloadPersonalData(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${this.apiUrl}/download-personal-data`);
  }

  getTwoFactorStatus(): Observable<TwoFactorStatus> {
    return this.http.get<TwoFactorStatus>(`${this.apiUrl}/two-factor`);
  }

  getAuthenticatorSetup(): Observable<AuthenticatorSetup> {
    return this.http.get<AuthenticatorSetup>(`${this.apiUrl}/enable-authenticator`);
  }

  enableAuthenticator(request: Enable2faRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/enable-authenticator`, request);
  }

  disable2fa(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/disable-2fa`, {});
  }

  resetAuthenticator(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/reset-authenticator`, {});
  }

  generateRecoveryCodes(): Observable<{ recoveryCodes: string[] }> {
    return this.http.post<{ recoveryCodes: string[] }>(`${this.apiUrl}/generate-recovery-codes`, {});
  }

  getExternalLogins(): Observable<ExternalLoginsInfo> {
    return this.http.get<ExternalLoginsInfo>(`${this.apiUrl}/external-logins`);
  }

  removeExternalLogin(request: RemoveExternalLoginRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/remove-external-login`, request);
  }

  forget2faClient(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/forget-2fa-client`, {});
  }
}
