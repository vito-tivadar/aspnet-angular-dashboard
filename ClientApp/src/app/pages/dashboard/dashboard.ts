import { Component } from '@angular/core';
import { StatCardsComponent, StatCard } from '../../components/stat-cards/stat-cards';
import { DataTableComponent, TableRow } from '../../components/data-table/data-table';
import { ChartPlaceholderComponent, ChartPlaceholderConfig } from '../../components/chart-placeholder/chart-placeholder';

/** Dashboard page — content only (layout is provided by DashboardLayoutComponent) */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardsComponent, DataTableComponent, ChartPlaceholderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  // ---------------------------------------------------------------------------
  // Stat cards data
  // ---------------------------------------------------------------------------
  readonly statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: '12,482',
      change: '↑ 8.2% vs last month',
      positive: true,
      colorKey: 'users',
      icon: 'users',
    },
    {
      title: 'Revenue',
      value: '$48,295',
      change: '↑ 12.5% vs last month',
      positive: true,
      colorKey: 'revenue',
      icon: 'currency-dollar',
    },
    {
      title: 'Orders',
      value: '3,741',
      change: '↓ 2.1% vs last month',
      positive: false,
      colorKey: 'orders',
      icon: 'package',
    },
    {
      title: 'Growth Rate',
      value: '23.6%',
      change: '↑ 4.0% vs last month',
      positive: true,
      colorKey: 'growth',
      icon: 'trending-up',
    },
  ];

  // ---------------------------------------------------------------------------
  // Chart configs
  // ---------------------------------------------------------------------------
  readonly revenueChartConfig: ChartPlaceholderConfig = {
    title: 'Revenue Over Time',
    subtitle: 'Monthly revenue for the last 12 months',
    height: '240px',
  };

  readonly usersChartConfig: ChartPlaceholderConfig = {
    title: 'User Signups',
    subtitle: 'Daily signups over the last 30 days',
    height: '240px',
  };

  // ---------------------------------------------------------------------------
  // Table data
  // ---------------------------------------------------------------------------
  readonly tableRows: TableRow[] = [
    { id: 1, name: 'Alice Johnson',  email: 'alice@example.com',  role: 'Admin',   status: 'active',   joined: '2024-01-15' },
    { id: 2, name: 'Bob Smith',      email: 'bob@example.com',    role: 'Editor',  status: 'active',   joined: '2024-02-03' },
    { id: 3, name: 'Carol White',    email: 'carol@example.com',  role: 'Viewer',  status: 'pending',  joined: '2024-03-22' },
    { id: 4, name: 'David Brown',    email: 'david@example.com',  role: 'Editor',  status: 'inactive', joined: '2024-04-10' },
    { id: 5, name: 'Eva Martinez',   email: 'eva@example.com',    role: 'Admin',   status: 'active',   joined: '2024-05-01' },
    { id: 6, name: 'Frank Lee',      email: 'frank@example.com',  role: 'Viewer',  status: 'pending',  joined: '2024-06-18' },
  ];
}
