import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  email = signal('');
  password = signal('');
  firstName = signal('');
  lastName = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.message.set('');
    this.authService
      .register({
        email: this.email(),
        password: this.password(),
        firstName: this.firstName(),
        lastName: this.lastName(),
      })
      .subscribe({
        next: () => {
          this.message.set('Registration successful. Please confirm your email.');
        },
        error: (err) => {
          const errors = err.error?.errors;
          this.errorMessage.set(
            (Array.isArray(errors) ? errors.join(', ') : errors) ||
              err.error?.message ||
              'Registration failed.',
          );
        },
      });
  }
}
