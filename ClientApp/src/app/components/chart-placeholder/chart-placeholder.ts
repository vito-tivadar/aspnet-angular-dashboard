import { Component, input } from '@angular/core';

export interface ChartPlaceholderConfig {
  title: string;
  subtitle?: string;
  height?: string;
}

/**
 * Chart placeholder component.
 * Styled as a glassmorphism panel matching the CY•FOCUS design.
 *
 * Replace the inner content with a real chart library integration
 * (e.g. ng2-charts / Chart.js, Apache ECharts, or Recharts) when ready.
 */
@Component({
  selector: 'app-chart-placeholder',
  standalone: true,
  templateUrl: './chart-placeholder.html',
  styleUrl: './chart-placeholder.css',
})
export class ChartPlaceholderComponent {
  config = input.required<ChartPlaceholderConfig>();
}
