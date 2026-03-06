import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-enable-authenticator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './enable-authenticator.html',
  styleUrl: './enable-authenticator.css',
})
export class EnableAuthenticatorComponent implements OnInit {
  sharedKey = signal('');
  authenticatorUri = signal('');
  qrCodeDataUrl = signal('');
  code = signal('');
  message = signal('');
  errorMessage = signal('');

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountService.getAuthenticatorSetup().subscribe({
      next: (setup) => {
        this.sharedKey.set(setup.sharedKey);
        this.authenticatorUri.set(setup.authenticatorUri);
        QRCode.toDataURL(setup.authenticatorUri, { width: 200, margin: 1 }).then(
          (url: string) => this.qrCodeDataUrl.set(url),
          () => this.errorMessage.set('Unable to generate QR code. Use the key above instead.')
        );
      },
      error: () => {
        this.errorMessage.set('Unable to load authenticator setup.');
      },
    });
  }

  onSubmit(): void {
    this.message.set('');
    this.errorMessage.set('');
    this.accountService.enableAuthenticator({ code: this.code() }).subscribe({
      next: () => {
        this.router.navigate(['/manage/show-recovery-codes']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Verification code is invalid.');
      },
    });
  }
}
