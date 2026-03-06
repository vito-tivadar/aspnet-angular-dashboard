import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent implements OnInit {
  email = signal('');
  token = signal('');
  newPassword = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token') ?? '');
    this.email.set(this.route.snapshot.queryParamMap.get('email') ?? '');
  }

  onSubmit(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.authService.resetPassword({ email: this.email(), token: this.token(), newPassword: this.newPassword() }).subscribe({
      next: () => {
        this.router.navigate(['/reset-password-confirmation']);
      },
      error: (err) => {
        const errors = err.error?.errors;
        this.errorMessage.set(
          (Array.isArray(errors) ? errors.join(', ') : errors) ||
          err.error?.message ||
          'An error occurred.');
      },
    });
  }
}
