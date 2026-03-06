import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
})
export class ConfirmEmailComponent implements OnInit {
  message = signal('');
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId') ?? '';
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!userId || !token) {
      this.errorMessage.set('Invalid confirmation link.');
      return;
    }

    this.authService.confirmEmail({ userId, token }).subscribe({
      next: () => {
        this.message.set('Thank you for confirming your email.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error confirming your email.');
      },
    });
  }
}
