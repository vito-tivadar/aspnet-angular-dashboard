import { NavGroup } from './sidebar';

/** Centralised navigation configuration for the sidebar. */
export const SIDEBAR_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: 'ti ti-chart-bar',       route: '/dashboard' },
      { label: 'Home',      icon: 'ti ti-home',            route: '/home' },
      { label: 'Privacy',   icon: 'ti ti-lock',            route: '/privacy' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Account',   icon: 'ti ti-user',            route: '/manage/account' },
      // { label: 'Profile',   icon: 'ti ti-user',            route: '/manage/profile' },
      // { label: 'Email',     icon: 'ti ti-mail',            route: '/manage/email' },
      // { label: 'Password',  icon: 'ti ti-key',             route: '/manage/change-password' },
      // { label: 'Security',  icon: 'ti ti-shield',          route: '/manage/two-factor-authentication' },
      // { label: 'Data',      icon: 'ti ti-clipboard-list',  route: '/manage/personal-data' },
    ],
  },
];
