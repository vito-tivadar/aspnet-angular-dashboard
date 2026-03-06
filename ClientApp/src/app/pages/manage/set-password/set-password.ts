import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './set-password.html',
  styleUrl: './set-password.css',
})
export class SetPasswordComponent {
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
    this.accountService.setPassword({ newPassword: this.newPassword() }).subscribe({
      next: () => {
        this.message.set('Your password has been set.');
        this.newPassword.set('');
        this.confirmPassword.set('');
      },
      error: (err) => {
        const errors = err.error?.errors;
        this.errorMessage.set(
          (Array.isArray(errors) ? errors.join(', ') : errors) ||
          err.error?.message ||
          'Error setting password.');
      },
    });
  }
}
