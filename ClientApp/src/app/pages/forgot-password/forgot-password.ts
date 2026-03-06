import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  email = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.authService.forgotPassword({ email: this.email() }).subscribe({
      next: () => {
        this.message.set('Please check your email to reset your password.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'An error occurred.');
      },
    });
  }
}
