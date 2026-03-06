import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { SidebarComponent } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import { TopbarComponent } from '../topbar/topbar';
import { SIDEBAR_NAV_GROUPS } from '../sidebar/sidebar-nav.config';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/home': 'Home',
  '/privacy': 'Privacy Policy',
  '/manage/account': 'Account',
  '/manage/profile': 'Profile',
  '/manage/email': 'Email Settings',
  '/manage/change-password': 'Change Password',
  '/manage/set-password': 'Set Password',
  '/manage/two-factor-authentication': 'Two-Factor Authentication',
  '/manage/enable-authenticator': 'Enable Authenticator',
  '/manage/disable-2fa': 'Disable 2FA',
  '/manage/reset-authenticator': 'Reset Authenticator',
  '/manage/generate-recovery-codes': 'Generate Recovery Codes',
  '/manage/show-recovery-codes': 'Recovery Codes',
  '/manage/personal-data': 'Personal Data',
  '/manage/download-personal-data': 'Download Personal Data',
  '/manage/delete-personal-data': 'Delete Account',
  '/manage/external-logins': 'External Logins',
};

/** Shared layout shell for all authenticated pages */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, TopbarComponent],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayoutComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  sidebarOpen = signal(false);
  pageTitle = signal('Portfolio');
  userName = signal('');
  userEmail = signal('');
  readonly isDark = computed(() => this.themeService.theme() === 'dark');

  readonly navGroups = SIDEBAR_NAV_GROUPS;

  constructor() {
    // Set title immediately for the first navigation
    this.pageTitle.set(this.getTitleForUrl(this.router.url));

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.pageTitle.set(this.getTitleForUrl(e.urlAfterRedirects));
      });
  }

  ngOnInit(): void {
    this.accountService.getProfile().subscribe({
      next: (profile) => {
        const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
        this.userName.set(name);
        this.userEmail.set(profile.email);
      },
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToAccount(): void {
    this.router.navigate(['/manage/account']);
  }

  private getTitleForUrl(url: string): string {
    for (const [path, title] of Object.entries(ROUTE_TITLES)) {
      if (url === path || url.startsWith(path + '?')) return title;
    }
    return 'Portfolio';
  }
}
