import { Component, input } from '@angular/core';

/** Top navigation bar — displays page title */
@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class TopbarComponent {
  pageTitle = input<string>('Dashboard');
}
