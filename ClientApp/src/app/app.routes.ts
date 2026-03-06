import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { HomeComponent } from './pages/home/home';
import { PrivacyComponent } from './pages/privacy/privacy';
import { AccessDeniedComponent } from './pages/access-denied/access-denied';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email';
import { ConfirmEmailChangeComponent } from './pages/confirm-email-change/confirm-email-change';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ForgotPasswordConfirmationComponent } from './pages/forgot-password-confirmation/forgot-password-confirmation';
import { LockoutComponent } from './pages/lockout/lockout';
import { LoginWith2faComponent } from './pages/login-with-2fa/login-with-2fa';
import { LoginWithRecoveryCodeComponent } from './pages/login-with-recovery-code/login-with-recovery-code';
import { RegisterConfirmationComponent } from './pages/register-confirmation/register-confirmation';
import { ResendEmailConfirmationComponent } from './pages/resend-email-confirmation/resend-email-confirmation';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { ResetPasswordConfirmationComponent } from './pages/reset-password-confirmation/reset-password-confirmation';
import { ProfileComponent } from './pages/manage/profile/profile';
import { ChangePasswordComponent } from './pages/manage/change-password/change-password';
import { SetPasswordComponent } from './pages/manage/set-password/set-password';
import { EmailComponent } from './pages/manage/email/email';
import { DeletePersonalDataComponent } from './pages/manage/delete-personal-data/delete-personal-data';
import { DownloadPersonalDataComponent } from './pages/manage/download-personal-data/download-personal-data';
import { PersonalDataComponent } from './pages/manage/personal-data/personal-data';
import { TwoFactorAuthenticationComponent } from './pages/manage/two-factor-authentication/two-factor-authentication';
import { EnableAuthenticatorComponent } from './pages/manage/enable-authenticator/enable-authenticator';
import { Disable2faComponent } from './pages/manage/disable-2fa/disable-2fa';
import { ResetAuthenticatorComponent } from './pages/manage/reset-authenticator/reset-authenticator';
import { GenerateRecoveryCodesComponent } from './pages/manage/generate-recovery-codes/generate-recovery-codes';
import { ShowRecoveryCodesComponent } from './pages/manage/show-recovery-codes/show-recovery-codes';
import { ExternalLoginsComponent } from './pages/manage/external-logins/external-logins';
import { AccountComponent } from './pages/manage/account/account';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ── Public auth routes (no layout) ────────────────────────────────────────
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-confirmation', component: RegisterConfirmationComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'confirm-email-change', component: ConfirmEmailChangeComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password-confirmation', component: ForgotPasswordConfirmationComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password-confirmation', component: ResetPasswordConfirmationComponent },
  { path: 'resend-email-confirmation', component: ResendEmailConfirmationComponent },
  { path: 'login-with-2fa', component: LoginWith2faComponent },
  { path: 'login-with-recovery-code', component: LoginWithRecoveryCodeComponent },
  { path: 'lockout', component: LockoutComponent },
  { path: 'access-denied', component: AccessDeniedComponent },

  // ── Protected routes (wrapped in dashboard layout) ─────────────────────────
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'home', component: HomeComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'manage/account', component: AccountComponent },
      { path: 'manage/profile', component: ProfileComponent },
      { path: 'manage/change-password', component: ChangePasswordComponent },
      { path: 'manage/set-password', component: SetPasswordComponent },
      { path: 'manage/email', component: EmailComponent },
      { path: 'manage/delete-personal-data', component: DeletePersonalDataComponent },
      { path: 'manage/download-personal-data', component: DownloadPersonalDataComponent },
      { path: 'manage/personal-data', component: PersonalDataComponent },
      { path: 'manage/two-factor-authentication', component: TwoFactorAuthenticationComponent },
      { path: 'manage/enable-authenticator', component: EnableAuthenticatorComponent },
      { path: 'manage/disable-2fa', component: Disable2faComponent },
      { path: 'manage/reset-authenticator', component: ResetAuthenticatorComponent },
      { path: 'manage/generate-recovery-codes', component: GenerateRecoveryCodesComponent },
      { path: 'manage/show-recovery-codes', component: ShowRecoveryCodesComponent },
      { path: 'manage/external-logins', component: ExternalLoginsComponent },
    ],
  },
];
