import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { FilterService } from '../../../../shared/filter-service';

@Component({
  selector: 'select-min-max',
  templateUrl: './select-min-max.component.html',
  styleUrls: ['./select-min-max.component.scss']
})
export class SelectMinMaxComponent implements OnInit {

  constructor(private filterService: FilterService) { }

  selectedMin: string | number;
  selectedMax: string | number;
  sortedMin: number[];
  sortedMax: number[];

  @Input() data: number[];
  @Input() searchedColumn: string;
  @Input() clearSelected: boolean;
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();

  @ViewChildren('selects') selects: QueryList<ElementRef>;

  ngOnInit(): void {
    if (this.outputFilteredData[this.searchedColumn] !== undefined) {
      this.selectedMin = this.outputFilteredData[this.searchedColumn].min ? this.outputFilteredData[this.searchedColumn].min : null;
      this.selectedMax = this.outputFilteredData[this.searchedColumn].max ? this.outputFilteredData[this.searchedColumn].max : null;

      if (this.outputFilteredData[this.searchedColumn].min && this.outputFilteredData[this.searchedColumn].max) {
        this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: this.selectedMin, max: this.selectedMax } });
      }
    }

    this.sortedMin = this.data.filter(i => i !== null).sort((a: number, b: number) => a - b);
    this.sortedMax = this.data.filter(i => i !== null).sort((a: number, b: number) => b - a);
  }

  ngOnChanges(changes: any) {
    if (changes.clearSelected && changes.clearSelected?.previousValue !== changes.clearSelected?.currentValue) {
      if (this.clearSelected) {
        this.selects.forEach((element) => (element as any).options.forEach((data: MatOption) => data.deselect()));
      }
    }
  }

  onChangeSelect() {
    this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: this.selectedMin, max: this.selectedMax } });
  }

}
