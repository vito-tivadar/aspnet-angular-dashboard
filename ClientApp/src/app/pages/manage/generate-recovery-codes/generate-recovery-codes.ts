import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-generate-recovery-codes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './generate-recovery-codes.html',
  styleUrl: './generate-recovery-codes.css',
})
export class GenerateRecoveryCodesComponent {
  recoveryCodes = signal<string[]>([]);
  errorMessage = signal('');
  generated = signal(false);

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  generate(): void {
    this.errorMessage.set('');
    this.accountService.generateRecoveryCodes().subscribe({
      next: (result) => {
        this.recoveryCodes.set(result.recoveryCodes);
        this.generated.set(true);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error generating recovery codes.');
      },
    });
  }
}
