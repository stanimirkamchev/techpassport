
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList, ViewChild  } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash'

@Component({
  selector: 'selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  constructor(private fb: FormBuilder
  ) { }

  @Input() data: any[];
  @Input() searchedColumn: string
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();
  filter = new FormControl()
  filteredData = new BehaviorSubject([])

  get filteredOptions() {
    if(this.filter.value) {
        return this.filteredData.getValue()
    } else {
      return this.data
    }
  }

  ngOnInit(): void {
    this.filter.valueChanges.pipe(
      debounceTime(500),
      map(value => this._filter(cloneDeep(this.data), value)),
    ).subscribe(res => {
      this.filteredData.next(res)
    });  }

  ngAfterViewInit(): void {
  }

  private _filter(arr: any[], value: string): any[] {
    const filterValue = value.toLowerCase();
    return arr.filter(t => t.toLowerCase().includes(filterValue))
  }

  ngOnChanges(changes: any) {
  }

  onChangeSelect() {
  }

  keydown(event) {

  }
}
