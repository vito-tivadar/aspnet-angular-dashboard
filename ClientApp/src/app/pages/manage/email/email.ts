import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class EmailComponent implements OnInit {
  currentEmail = signal('');
  isEmailConfirmed = signal(false);
  newEmail = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getEmail().subscribe({
      next: (info) => {
        this.currentEmail.set(info.email);
        this.isEmailConfirmed.set(info.isEmailConfirmed);
      },
      error: () => {
        this.errorMessage.set('Unable to load email info.');
      },
    });
  }

  onSubmit(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.accountService.changeEmail({ newEmail: this.newEmail() }).subscribe({
      next: () => {
        this.message.set('Confirmation link to change email sent. Please check your email.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error changing email.');
      },
    });
  }
}
