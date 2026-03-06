import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-with-2fa',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-with-2fa.html',
  styleUrl: './login-with-2fa.css',
})
export class LoginWith2faComponent {
  twoFactorCode = signal('');
  rememberMachine = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
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
