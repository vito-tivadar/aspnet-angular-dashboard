import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-two-factor-authentication',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './two-factor-authentication.html',
  styleUrl: './two-factor-authentication.css',
})
export class TwoFactorAuthenticationComponent implements OnInit {
  hasAuthenticator = signal(false);
  is2faEnabled = signal(false);
  isMachineRemembered = signal(false);
  recoveryCodesLeft = signal(0);
  errorMessage = signal('');
  message = signal('');

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getTwoFactorStatus().subscribe({
      next: (status) => {
        this.hasAuthenticator.set(status.hasAuthenticator);
        this.is2faEnabled.set(status.is2faEnabled);
        this.isMachineRemembered.set(status.isMachineRemembered);
        this.recoveryCodesLeft.set(status.recoveryCodesLeft);
      },
      error: () => {
        this.errorMessage.set('Unable to load two-factor authentication status.');
      },
    });
  }

  forgetBrowser(): void {
    this.message.set('');
    this.accountService.forget2faClient().subscribe({
      next: () => {
        this.message.set('The current browser has been forgotten.');
        this.isMachineRemembered.set(false);
      },
    });
  }
}
