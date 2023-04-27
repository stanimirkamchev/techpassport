
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'slider-range',
  templateUrl: './slider-range.component.html',
  styleUrls: ['./slider-range.component.scss']
})
export class SliderRangeComponent implements OnInit {
  constructor() {}

  options: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number): string => {
      return value + '%';
    }
  };

  @Input() value: number = 0;
  @Input() maxValue: number = 100;
  @Input() data: number[];
  @Input() searchedColumn: string
  @Input() outputFilteredData: {};
  @Input() manualRefresh: EventEmitter<void>;
  @Output() outputSelectedItems = new EventEmitter<{}>();

  ngOnInit(): void {
  }

  ngAfterViewInit() {}

  ngOnChanges(changes: any) {
  }

  onChangeSelect() {
    this.outputSelectedItems.emit({column: this.searchedColumn, items: [{name: this.value}, {name: this.maxValue}]});
  }
}
