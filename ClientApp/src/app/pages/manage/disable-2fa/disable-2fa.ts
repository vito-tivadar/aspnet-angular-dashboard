import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-disable-2fa',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './disable-2fa.html',
  styleUrl: './disable-2fa.css',
})
export class Disable2faComponent {
  errorMessage = signal('');

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  disable(): void {
    this.errorMessage.set('');
    this.accountService.disable2fa().subscribe({
      next: () => {
        this.router.navigate(['/manage/two-factor-authentication']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error disabling 2FA.');
      },
    });
  }
}
