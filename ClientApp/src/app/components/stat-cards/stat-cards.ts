import { Component, input, computed } from '@angular/core';
import { DASHBOARD_COLORS } from '../../config/colors';

export interface StatCard {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  /** Key into DASHBOARD_COLORS.stats */
  colorKey: keyof typeof DASHBOARD_COLORS.stats;
  icon: string;
}

/**
 * Displays a grid of stat / KPI cards at the top of the dashboard.
 * Styled as a glassmorphism metrics section matching the CY•FOCUS design.
 */
@Component({
  selector: 'app-stat-cards',
  standalone: true,
  templateUrl: './stat-cards.html',
  styleUrl: './stat-cards.css',
})
export class StatCardsComponent {
  cards = input.required<StatCard[]>();
  readonly colors = DASHBOARD_COLORS;
}
