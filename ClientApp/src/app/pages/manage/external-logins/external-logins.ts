import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { ExternalLoginsInfo } from '../../../models/auth.models';

@Component({
  selector: 'app-external-logins',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './external-logins.html',
  styleUrl: './external-logins.css',
})
export class ExternalLoginsComponent implements OnInit {
  info = signal<ExternalLoginsInfo | null>(null);
  message = signal('');
  errorMessage = signal('');

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.accountService.getExternalLogins().subscribe({
      next: (data) => {
        this.info.set(data);
      },
      error: () => {
        this.errorMessage.set('Unable to load external logins.');
      },
    });
  }

  remove(loginProvider: string, providerKey: string): void {
    this.message.set('');
    this.errorMessage.set('');
    this.accountService.removeExternalLogin({ loginProvider, providerKey }).subscribe({
      next: () => {
        this.message.set('External login removed.');
        this.load();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error removing external login.');
      },
    });
  }
}
