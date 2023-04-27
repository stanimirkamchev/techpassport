import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { DashboardSecurityTrends } from '../../store/dashboard.model';
import { DonutChart } from '@shared/chart-donut/chart-donut.component';

@Component({
  selector: 'dashboard-trends',
  templateUrl: './dashboard-trends.component.html',
  styleUrls: ['./dashboard-trends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTrendsComponent implements OnInit {

  @Output() previewTrends = new EventEmitter();

  @Input() loading: boolean;
  @Input() set trends(trends: DashboardSecurityTrends) {
    if (!trends) {
      return;
    }
    this.trendsChart = {
      color: "pink",
      label: trends.title,
      total: trends.total,
      data: {
        datasets: [{
          data: trends.data.map(x => x.value)
        }],
        labels: trends.data.map(x => x.label)
      }
    };
  }

  trendsChart: DonutChart;

  constructor() { }

  ngOnInit() {
  }
}
