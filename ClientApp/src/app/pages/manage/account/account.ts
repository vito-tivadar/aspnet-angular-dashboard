import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountComponent implements OnInit {
  // Profile
  firstName = signal('');
  lastName = signal('');
  phoneNumber = signal('');
  profileMessage = signal('');
  profileError = signal('');

  // Email
  currentEmail = signal('');
  isEmailConfirmed = signal(false);
  newEmail = signal('');
  emailMessage = signal('');
  emailError = signal('');

  // Password
  oldPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  passwordMessage = signal('');
  passwordError = signal('');

  // 2FA
  hasAuthenticator = signal(false);
  is2faEnabled = signal(false);
  isMachineRemembered = signal(false);
  recoveryCodesLeft = signal(0);
  securityMessage = signal('');
  securityError = signal('');

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadEmail();
    this.loadSecurity();
  }

  // ── Profile ──────────────────────────────────────────────────────────
  private loadProfile(): void {
    this.accountService.getProfile().subscribe({
      next: (p) => {
        this.firstName.set(p.firstName ?? '');
        this.lastName.set(p.lastName ?? '');
        this.phoneNumber.set(p.phoneNumber ?? '');
      },
      error: () => this.profileError.set('Unable to load profile.'),
    });
  }

  saveProfile(): void {
    this.profileMessage.set('');
    this.profileError.set('');
    this.accountService.updateProfile({
      firstName: this.firstName(),
      lastName: this.lastName(),
      phoneNumber: this.phoneNumber(),
    }).subscribe({
      next: () => this.profileMessage.set('Your profile has been updated.'),
      error: (err) => this.profileError.set(err.error?.message || 'Error updating profile.'),
    });
  }

  // ── Email ────────────────────────────────────────────────────────────
  private loadEmail(): void {
    this.accountService.getEmail().subscribe({
      next: (info) => {
        this.currentEmail.set(info.email);
        this.isEmailConfirmed.set(info.isEmailConfirmed);
      },
      error: () => this.emailError.set('Unable to load email info.'),
    });
  }

  changeEmail(): void {
    this.emailMessage.set('');
    this.emailError.set('');
    this.accountService.changeEmail({ newEmail: this.newEmail() }).subscribe({
      next: () => this.emailMessage.set('Confirmation link sent. Please check your email.'),
      error: (err) => this.emailError.set(err.error?.message || 'Error changing email.'),
    });
  }

  // ── Password ─────────────────────────────────────────────────────────
  changePassword(): void {
    this.passwordMessage.set('');
    this.passwordError.set('');
    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('Passwords do not match.');
      return;
    }
    this.accountService.changePassword({
      oldPassword: this.oldPassword(),
      newPassword: this.newPassword(),
    }).subscribe({
      next: () => {
        this.passwordMessage.set('Your password has been changed.');
        this.oldPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
      },
      error: (err) => {
        const errors = err.error?.errors;
        this.passwordError.set(
          (Array.isArray(errors) ? errors.join(', ') : errors) ||
          err.error?.message || 'Error changing password.');
      },
    });
  }

  // ── Security (2FA) ──────────────────────────────────────────────────
  private loadSecurity(): void {
    this.accountService.getTwoFactorStatus().subscribe({
      next: (s) => {
        this.hasAuthenticator.set(s.hasAuthenticator);
        this.is2faEnabled.set(s.is2faEnabled);
        this.isMachineRemembered.set(s.isMachineRemembered);
        this.recoveryCodesLeft.set(s.recoveryCodesLeft);
      },
      error: () => this.securityError.set('Unable to load 2FA status.'),
    });
  }

  forgetBrowser(): void {
    this.securityMessage.set('');
    this.accountService.forget2faClient().subscribe({
      next: () => {
        this.securityMessage.set('The current browser has been forgotten.');
        this.isMachineRemembered.set(false);
      },
    });
  }
}
