import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  firstName = signal('');
  lastName = signal('');
  phoneNumber = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getProfile().subscribe({
      next: (profile) => {
        this.firstName.set(profile.firstName ?? '');
        this.lastName.set(profile.lastName ?? '');
        this.phoneNumber.set(profile.phoneNumber ?? '');
      },
      error: () => {
        this.errorMessage.set('Unable to load profile.');
      },
    });
  }

  onSubmit(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.accountService.updateProfile({
      firstName: this.firstName(),
      lastName: this.lastName(),
      phoneNumber: this.phoneNumber(),
    }).subscribe({
      next: () => {
        this.message.set('Your profile has been updated.');
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error updating profile.');
      },
    });
  }
}
