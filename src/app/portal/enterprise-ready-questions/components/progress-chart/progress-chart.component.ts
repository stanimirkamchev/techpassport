import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
type Equation = { completed: number, compliant: number };

@Component({
  selector: 'progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent implements OnInit, OnChanges {

  @Input() data: Equation = {
    completed: 0,
    compliant: 0
  };

  completed = {
    // label: 'Label top',
    total: 0.4,
    data: {
      datasets: [{
        data: [10, 30, 0]
      }],
      labels: 'Label sum',
    }
  };

  compliant = {
    // label: 'Label top',
    total: 0.4,
    data: {
      datasets: [{
        data: [10, 30, 0]
      }],
      labels: 'Label sum',
    },
  };
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.completed = {
      total: Number(changes.data.currentValue.completed.toFixed(0)),
      data: {
        datasets: [{
          data: [Number(Number(changes.data.currentValue.completed).toFixed(0)), Number((100 - Number(changes.data.currentValue.completed)).toFixed(0)), 0]
        }],
        labels: 'Label sum',
      }
    };

    this.compliant = {
      total: Number(changes.data.currentValue.compliant.toFixed(0)),
      data: {
        datasets: [{
          data: [Number(Number(changes.data.currentValue.compliant).toFixed(0)), Number((100 - Number(changes.data.currentValue.compliant)).toFixed(0)), 0]
        }],
        labels: 'Label sum',
      }
    };
  }

  ngOnInit(): void {
  }
}
