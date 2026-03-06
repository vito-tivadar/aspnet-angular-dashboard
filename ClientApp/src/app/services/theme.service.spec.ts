import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  // Provide a stable initial OS preference so tests don't depend on the runner's config.
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  };

  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false); // default: light OS preference

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light mode when localStorage is empty and OS prefers light', () => {
    expect(service.theme()).toBe('light');
    expect(service.isDark).toBe(false);
  });

  it('should default to dark mode when OS prefers dark', () => {
    localStorage.clear();
    mockMatchMedia(true);
    // Re-create the service to pick up the new media query mock
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(ThemeService);
    expect(freshService.theme()).toBe('dark');
  });

  it('should restore saved theme from localStorage', () => {
    localStorage.setItem('portfolio-theme', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(ThemeService);
    expect(freshService.theme()).toBe('dark');
    expect(freshService.isDark).toBe(true);
  });

  it('should toggle between dark and light', () => {
    // Start from light
    service.theme.set('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('should add/remove the "dark" class on <html> when toggled', async () => {
    service.theme.set('light');
    // effect runs synchronously in the test zone after change detection
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    service.toggle();
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should persist theme changes to localStorage', () => {
    service.theme.set('light');
    TestBed.flushEffects();
    service.toggle(); // → dark
    TestBed.flushEffects();
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
  });
});
