import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-download-personal-data',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './download-personal-data.html',
  styleUrl: './download-personal-data.css',
})
export class DownloadPersonalDataComponent {
  personalData = signal<Record<string, string> | null>(null);
  errorMessage = signal('');

  constructor(private accountService: AccountService) {}

  download(): void {
    this.errorMessage.set('');
    this.accountService.downloadPersonalData().subscribe({
      next: (data) => {
        this.personalData.set(data);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PersonalData.json';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error downloading data.');
      },
    });
  }
}
