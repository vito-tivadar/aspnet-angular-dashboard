import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-delete-personal-data',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-personal-data.html',
  styleUrl: './delete-personal-data.css',
})
export class DeletePersonalDataComponent {
  password = signal('');
  errorMessage = signal('');

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.accountService.deletePersonalData({ password: this.password() }).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error deleting account.');
      },
    });
  }
}
