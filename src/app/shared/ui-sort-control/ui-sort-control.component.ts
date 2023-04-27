import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'ui-sort-control',
  templateUrl: './ui-sort-control.component.html',
  styleUrls: ['./ui-sort-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSortControlComponent),
      multi: true
    }
  ]
})
export class UiSortControlComponent<T> implements ControlValueAccessor {

  @Input() options: T;

  sort: Sort;

  onChange = () => {};
  onTouch = () => {};

  writeValue(sort: Sort) {
    this.sort = sort;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
