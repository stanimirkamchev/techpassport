import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'feedback-control-rating',
  templateUrl: './feedback-control-rating.component.html',
  styleUrls: ['./feedback-control-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FeedbackControlRatingComponent),
    multi: true
  }]
})
export class FeedbackControlRatingComponent implements OnInit, ControlValueAccessor {

  @Input() label: string;
  @Input() formDisabled: boolean;

  value = 0;
  onChange: any = () => { };
  onTouch: any = () => { };

  constructor() { }

  ngOnInit() {
  }

  rate({ newValue }) {
    this.writeValue(newValue);
  }

  writeValue(value: any) {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
