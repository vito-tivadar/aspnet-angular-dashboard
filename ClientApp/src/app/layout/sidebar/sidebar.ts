import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Left sidebar navigation — glassmorphism panel */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  open = input<boolean>(true);
  navGroups = input.required<NavGroup[]>();
  isDark = input<boolean>(false);
  userName = input<string>('');
  userEmail = input<string>('');
  closeSidebar = output<void>();
  logoutClicked = output<void>();
  themeToggle = output<void>();
  profileClicked = output<void>();

  profileDropupOpen = signal(false);

  toggleProfileDropup(): void {
    this.profileDropupOpen.update(v => !v);
  }
}
