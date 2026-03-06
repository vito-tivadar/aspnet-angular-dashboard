import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

/**
 * ThemeService manages the global dark/light mode for the application.
 *
 * The selected theme is persisted in localStorage so it survives page reloads.
 * Theme is applied by toggling the `dark` class on the `<html>` element,
 * which works with Tailwind CSS's `darkMode: 'class'` strategy.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Reactive signal holding the current theme */
  readonly theme = signal<Theme>(this.loadTheme());

  constructor() {
    // Whenever the theme signal changes, update the DOM and persist the preference.
    effect(() => {
      const current = this.theme();
      this.applyTheme(current);
      localStorage.setItem(STORAGE_KEY, current);
    });
  }

  /** Toggle between dark and light mode */
  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  /** Returns true when dark mode is active */
  get isDark(): boolean {
    return this.theme() === 'dark';
  }

  // ---------------------------------------------------------------------------

  private loadTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    // Fall back to the OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
