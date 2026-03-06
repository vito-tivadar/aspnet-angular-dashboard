import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-email-change',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-email-change.html',
  styleUrl: './confirm-email-change.css',
})
export class ConfirmEmailChangeComponent implements OnInit {
  message = signal('');
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId') ?? '';
    const newEmail = this.route.snapshot.queryParamMap.get('newEmail') ?? '';
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!userId || !newEmail || !token) {
      this.errorMessage.set('Invalid email change link.');
      return;
    }

    this.authService.confirmEmailChange({ userId, newEmail, token }).subscribe({
      next: () => {
        this.message.set('Your email has been changed successfully.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error changing your email.');
      },
    });
  }
}
