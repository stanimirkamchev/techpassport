import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../common/abstract/destroyable';
import { FeedbackControlOption } from '../feedback.model';

@Component({
  selector: 'feedback-control-select',
  templateUrl: './feedback-control-select.component.html',
  styleUrls: ['./feedback-control-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FeedbackControlSelectComponent),
    multi: true
  }]
})
export class FeedbackControlSelectComponent extends Destroyable
  implements OnInit, ControlValueAccessor {

  @Input() label: string;
  @Input() formDisabled: boolean;
  @Input() options: FeedbackControlOption[];

  formGroup = new FormGroup({
    select: new FormControl('')
  });

  onChange: any = () => { };
  onTouch: any = () => { };

  constructor() {
    super();
  }

  ngOnInit() {
    this.formGroup.get('select').valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => this.writeValue(value));
  }

  writeValue(value: string) {
    this.formGroup.get('select').setValue(value, { emitEvent: false });
    this.onChange(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
