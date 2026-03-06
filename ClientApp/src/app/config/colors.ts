/**
 * Centralized color palette configuration.
 * Modify these values to quickly rebrand the entire dashboard.
 * Colors are mapped to CSS custom properties in styles.css.
 */
export const DASHBOARD_COLORS = {
  /** Primary brand color used for active states, highlights, and CTAs */
  primary: {
    light: '#FF5A1F',
    dark: '#FF5A1F',
  },
  /** Surface / card backgrounds */
  surface: {
    light: '#0F171D',
    dark: '#0F171D',
  },
  /** Page background */
  background: {
    light: '#0B0F12',
    dark: '#0B0F12',
  },
  /** Sidebar background */
  sidebar: {
    light: '#0F171D',
    dark: '#0F171D',
  },
  /** Top-bar background */
  topbar: {
    light: '#0F171D',
    dark: '#0F171D',
  },
  /** Default text on surfaces */
  text: {
    light: '#f1f5f9',
    dark: '#f1f5f9',
  },
  /** Muted / secondary text */
  textMuted: {
    light: 'rgba(255,255,255,.55)',
    dark: 'rgba(255,255,255,.55)',
  },
  /** Border / divider lines */
  border: {
    light: 'rgba(255,255,255,.08)',
    dark: 'rgba(255,255,255,.08)',
  },
  /** Stat card accent colors (Tailwind utility classes) */
  stats: {
    users:   { bg: 'bg-orange/15',  icon: 'text-orange' },
    revenue: { bg: 'bg-green/15',   icon: 'text-green' },
    orders:  { bg: 'bg-amber/15',   icon: 'text-amber' },
    growth:  { bg: 'bg-red/15',     icon: 'text-red' },
  },
} as const;
