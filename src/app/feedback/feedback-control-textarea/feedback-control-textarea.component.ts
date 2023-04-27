import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';
import { Destroyable } from '../../common/abstract/destroyable';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'feedback-control-textarea',
  templateUrl: './feedback-control-textarea.component.html',
  styleUrls: ['./feedback-control-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FeedbackControlTextareaComponent),
    multi: true
  }]
})
export class FeedbackControlTextareaComponent extends Destroyable implements OnInit, ControlValueAccessor {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() formDisabled: boolean;

  formGroup = new FormGroup({
    textarea: new FormControl('')
  });

  onChange: any = () => { };
  onTouch: any = () => { };

  constructor() {
    super();
  }

  ngOnInit() {
    this.formGroup.get('textarea').valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => this.writeValue(value));
  }

  writeValue(value: any) {
    this.formGroup.get('textarea').setValue(value, { emitEvent: false });
    this.onChange(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
}
