import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-reset-authenticator',
  standalone: true,
  imports: [],
  templateUrl: './reset-authenticator.html',
  styleUrl: './reset-authenticator.css',
})
export class ResetAuthenticatorComponent {
  errorMessage = signal('');

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  reset(): void {
    this.errorMessage.set('');
    this.accountService.resetAuthenticator().subscribe({
      next: () => {
        this.router.navigate(['/manage/enable-authenticator']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error resetting authenticator.');
      },
    });
  }
}
