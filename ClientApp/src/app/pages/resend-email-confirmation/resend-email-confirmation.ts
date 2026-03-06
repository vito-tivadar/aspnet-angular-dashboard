import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resend-email-confirmation',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './resend-email-confirmation.html',
  styleUrl: './resend-email-confirmation.css',
})
export class ResendEmailConfirmationComponent {
  email = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.authService.resendEmailConfirmation({ email: this.email() }).subscribe({
      next: () => {
        this.message.set('Verification email sent. Please check your email.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'An error occurred.');
      },
    });
  }
}
