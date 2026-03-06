import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-with-recovery-code',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-with-recovery-code.html',
  styleUrl: './login-with-recovery-code.css',
})
export class LoginWithRecoveryCodeComponent {
  recoveryCode = signal('');
  rememberMe = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.authService.loginWithRecoveryCode({ recoveryCode: this.recoveryCode(), rememberMe: this.rememberMe() }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Invalid recovery code.');
      },
    });
  }
}
