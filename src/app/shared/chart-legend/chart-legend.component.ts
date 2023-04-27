import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartLegendComponent {

  @Input() labels: string[];
  @Input() values: number[];
  @Input() colorScheme: any;
}
