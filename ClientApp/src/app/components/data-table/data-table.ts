import { Component, input } from '@angular/core';

export interface TableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joined: string;
}

/** Status badge styles */
const STATUS_CLASSES: Record<TableRow['status'], string> = {
  active:   'bg-green/15 text-green border border-green/25',
  inactive: 'bg-white/5 text-white/55 border border-border',
  pending:  'bg-amber/15 text-amber border border-amber/25',
};

/**
 * A simple responsive data table for the dashboard.
 * Styled as a glassmorphism panel matching the CY•FOCUS design.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTableComponent {
  title = input<string>('Recent Users');
  rows = input.required<TableRow[]>();

  statusClass(status: TableRow['status']): string {
    return STATUS_CLASSES[status];
  }
}
