import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { DashboardKPIs } from '../../store/dashboard.model';
import { DonutChart } from '@shared/chart-donut/chart-donut.component';

@Component({
  selector: 'dashboard-kpis',
  templateUrl: './dashboard-kpis.component.html',
  styleUrls: ['./dashboard-kpis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardKpisComponent implements OnInit {

  @Output() previewMarket = new EventEmitter();
  @Output() previewSearches = new EventEmitter();
  @Output() previewTechnologies = new EventEmitter();

  @Input() loading: boolean;
  @Input() set kpis(kpis: DashboardKPIs) {
    if (!kpis) {
      return;
    }

    this.marketplaceChart = {
      label: kpis.marketPlace.title,
      total: kpis.marketPlace.total,
      data: {
        datasets: [{
          data: kpis.marketPlace.data.map(x => x.value)
        }],
        labels: kpis.marketPlace.data.map(x => x.label)
      }
    };
    this.searchesChart = {
      label: kpis.searches.title,
      total: kpis.searches.total,
      data: {
        datasets: [{
          data: kpis.searches.data.map(x => x.value)
        }],
        labels: kpis.searches.data.map(x => x.label)
      }
    };
    this.technologyChart = {
      label: kpis.technologies.title,
      total: kpis.technologies.total,
      data: {
        datasets: [{
          data: kpis.technologies.data.map(x => x.value)
        }],
        labels: kpis.technologies.data.map(x => x.label)
      }
    };
  };



  chart: DonutChart;
  marketplaceChart: DonutChart;
  searchesChart: DonutChart;
  technologyChart: DonutChart;

  ngOnInit() {

  }
}
