import { Component, AfterViewInit, OnInit, ChangeDetectionStrategy, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

//import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';
import { BlueWarm6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

import { ChartData } from 'chart.js';
//import * as Chart from 'chart.js';
//import * as dashboardActions from './../../store/dashboard.actions';

import * as d3 from 'd3';
import * as d3Scale from "d3-scale-chromatic";



import { emit } from 'process';
import { Store } from '@ngrx/store';

import { State } from './../../dashboard/store/dashboard.reducer';
import * as dashboardActions from './../../dashboard/store/dashboard.actions';


export interface DonutChart {
  data: ChartData;
  title?: string,
  label?: string,
  total?: number,
  options?: Chart.ChartOptions;
  color?: string
}
export interface Item {
  name: string;
  value: number;
  abs: number;
}

@Component({
  selector: 'chart-donut',
  templateUrl: './chart-donut.component.html',
  styleUrls: ['./chart-donut.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartDonutComponent implements AfterViewInit, OnInit {


  //@ViewChild('chartEl') chartEl: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieEl') pieEl: ElementRef<HTMLCanvasElement>;



  @Input() chart: DonutChart;
  @Input() title: string;
  @Input() detailsAction: any;
  @Input() toolTipAligment: string;



  BlueWarm6 = BlueWarm6;

  //
  private dataSource: Item[];

  ///
  get height(): number { return 180 }//parseInt(d3.select('body').style('height'), 10)
  get width(): number { return 180 } //parseInt(d3.select('body').style('width'), 10)
  private radius: number;
  private arc: any; private pie: any; private slices: any;
  private color: any;
  private svg: any; private mainContainer: any;
  private arcLabel: any;
  private texts: any;
  private tooltip: any;
  private labelTotal: any;
  private total = 0;


  getData(): Item[] {
    if (!this.chart.data?.datasets || !this.chart.data?.datasets[0]) {
      return [];
    }
    const dataset = this.chart.data?.datasets[0]?.data || [];
    const dt = [];
    for (let i = 0; i < dataset.length; i++) {
      const val = dataset[i] as number;
      const name = this.chart.data.labels[i];
      this.total += val;
      dt.push({
        name: name,
        value: val,
        abs: Math.abs(val)
      });
    }
    return dt;
  }
  ///



  ngAfterViewInit() {
    try {
      this.dataSource = this.getData();
      // console.log('  this.dataSource', this.chart, this.dataSource)
      let k = this.dataSource.length;
      if (k > 8)
        k = 8;

      this.svg = d3.select(this.pieEl.nativeElement).select('svg');
      this.setSVGDimensions();
      let css_class = 'pie-tooltip';

      if (this.chart.color === 'pink') {
        this.color = d3.scaleOrdinal(d3Scale.schemeRdPu[k])
        css_class = 'pie-pink-tooltip';
      }
      else {
        let colorPal = [...d3Scale.schemeBlues[k]];
        colorPal[0] = '#E0E0EF';
        this.color = d3.scaleOrdinal(colorPal)
      }
      // / scaleOrdinal scaleDiverging

      this.mainContainer = this.svg.append('g').attr('transform', `translate(${this.radius},${this.radius})`);
      this.pie = d3.pie().sort(null).value((d: any) => d.abs);
      this.draw();

      this.tooltip = d3.select(this.pieEl.nativeElement)
        .append('div').attr('class', css_class).style('display', 'none').style('opacity', 0);
    } catch (error) {
      console.log(error);
    }

  }
  ngOnInit() {

  }
  private setSVGDimensions() {
    this.radius = (Math.min(this.width, this.height)) / 2;
    this.svg.attr('width', 2 * this.radius).attr('height', 2 * this.radius);
    this.svg.select('g').attr('transform', 'translate(' + this.radius + ',' + this.radius + ')');
  }

  private draw() {
    this.setArcs();
    this.initSvg();
    this.drawSlices();
  }

  private setArcs() {
    this.arc = d3.arc().outerRadius(this.radius).innerRadius(this.radius * .63);
    this.arcLabel = d3.arc().innerRadius(this.radius * .8).outerRadius(this.radius * .63);
  }

  private initSvg() {
    let totalText = `Total: ${this.chart.total}`;
    if (this.chart.label)
      totalText = `${this.chart.label}: \n${this.chart.total}`;

    let css_class = 'pie-inner-title';
    if (this.chart.color === 'pink')
      css_class = 'pie-pink-inner-title';
    this.labelTotal = this.mainContainer.append('text')
      .attr('text-anchor', 'middle')
      .attr('class', css_class)
      .attr('dy', '.5em').text(totalText);
  }



  private drawSlices() {
    this.slices = this.mainContainer.selectAll('path')
      .remove().exit()
      .data(this.pie(this.dataSource))
      .enter().append('g').append('path')
      .attr('d', this.arc);
    this.slices
      .attr('fill', (d, i) => this.color(i));

    this.slices
      .attr('fill', (d, i) => this.color(i))
      .on('mousemove', function (s, d) {
        const percent = (Math.abs(d.data.abs / this.total) * 100).toFixed(2) + '%';
        this.tooltip.style('top', (s.layerY + 15) + 'px').style(this.toolTipAligment, (s.layerX) + 'px')
          .style('display', 'block').style('opacity', 1).style('height', '40px').style('z-index', '100000')
        this.tooltip.html(`${d.data.name}: <strong>${d.data.value}</strong><br>share: <strong>${percent}</strong>`);
      }.bind(this))
      .on('mouseout', function () {
        this.tooltip.style('display', 'none').style('opacity', 0);
      }.bind(this));
  }


  public doEmit() {
    this.detailsAction.emit();
    //this.previewMarket.emit()
    //this.store.dispatch(dashboardActions.loadMarketPreview());
  }
}













/*

 ngAfterViewInit() {
    const myDoughnutChart = new Chart(this.chartEl.nativeElement, {
      type: 'doughnut',
      data: {
        ...this.chart.data,
        datasets: this.chart.data.datasets.map(dataset => ({
          ...dataset
        }))
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        legend: {
          display: false,
          fullWidth: false,
          position: 'bottom'
        },
        plugins: {
          colorschemes: {
            scheme: BlueWarm6
          }
        },
        ...this.chart.options,
      }
    });
  }
*/
