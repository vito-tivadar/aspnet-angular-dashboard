import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent {
  oldPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(private accountService: AccountService) {}

  onSubmit(): void {
    this.message.set('');
    this.errorMessage.set('');
    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }
    this.accountService.changePassword({ oldPassword: this.oldPassword(), newPassword: this.newPassword() }).subscribe({
      next: () => {
        this.message.set('Your password has been changed.');
        this.oldPassword.set('');
        this.newPassword.set('');
        this.confirmPassword.set('');
      },
      error: (err) => {
        const errors = err.error?.errors;
        this.errorMessage.set(
          (Array.isArray(errors) ? errors.join(', ') : errors) ||
          err.error?.message ||
          'Error changing password.');
      },
    });
  }
}
