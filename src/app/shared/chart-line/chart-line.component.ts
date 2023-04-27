import { Component, ElementRef, Input, AfterViewInit, ViewChild } from '@angular/core';
//import { BlueWarm6, Slipstream6, Codex6, } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
import { Spectral11 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer';
import { ChartData } from 'chart.js';
import * as Chart from 'chart.js';

export interface LineChart {
  data: ChartData;
  title?: string,
  options?: Chart.ChartOptions;
}

@Component({
  selector: 'chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent implements AfterViewInit {

  @ViewChild('chartEl') chartEl: ElementRef<HTMLCanvasElement>;

  @Input() set chart(chart: LineChart) {
    this._chart = chart;
    if (this.chartEl?.nativeElement) {
      this.drawChart();
    }
  }

  @Input() title: string;

  BlueWarm6 = Spectral11;//BlueWarm6;

  private _chart: LineChart;

  constructor() { }

  ngAfterViewInit() {
    if (this._chart) {
      this.drawChart();
    }
  }

  drawChart() {
    const myLineChart = new Chart(this.chartEl.nativeElement, {
      type: 'line',
      data: {
        ...this._chart.data.datasets,
        datasets: this._chart.data.datasets.map(dataset => ({
          ...dataset, fill: false
        }))
      },
      options: {
        //scaleStartValue: 0, 
        responsive: true,
        //aspectRatio: 1,
        legend: {
          display: true,
          fullWidth: false,
          position: 'bottom'
        },
        plugins: {
          colorschemes: {
            scheme: Spectral11//Codex6//,BlueWarm6
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              parser: 'YYYY-MM-DDThh:mm:ssZ',
              unit: 'day',
              //tooltipFormat: 'll HH:mm'
            },
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [{
            //scaleStartValue: 0,
            scaleLabel: {
              display: true,
              labelString: 'POCs'
            }
          }]
        },
        ...this._chart.options,
      }
    });
  }

} 
