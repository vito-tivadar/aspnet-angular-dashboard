import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  errorMessage = signal('');

  requiresTwoFactor = signal(false);
  twoFactorCode = signal('');
  rememberMachine = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.authService
      .login({ email: this.email(), password: this.password(), rememberMe: this.rememberMe() })
      .subscribe({
      next: (response) => {
        if (response.requiresTwoFactor) {
          this.requiresTwoFactor.set(true);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Login failed.');
      },
    });
  }

  onSubmit2fa(): void {
    this.errorMessage.set('');
    this.authService
      .loginWith2fa({
        twoFactorCode: this.twoFactorCode(),
        rememberMachine: this.rememberMachine(),
      })
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Invalid authenticator code.');
        },
      });
  }
}
