import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { FormTracker } from '../../form-tracker';

@Component({
  templateUrl: './data-access.component.html',
  selector: 'data-access',
  styleUrls: ['./data-access.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DataAccessComponent),
    multi: true
  }]
})
export class DataAccessComponent extends Destroyable implements OnInit, OnChanges, ControlValueAccessor {
  dataAccessForm: FormGroup;
  loading = false;

  onChangeFn: Function;
  onTouched: Function;

  @Input() onlyMandatory: boolean;
  @Input() submitted = false;
  @Input() formName: string;

  weekOptions = [
    {
      label: 'Monday',
      value: 'Monday'
    },
    {
      label: 'Tuesday',
      value: 'Tuesday'
    },
    {
      label: 'Wednesday',
      value: 'Wednesday'
    },
    {
      label: 'Thursday',
      value: 'Thursday'
    },
    {
      label: 'Friday',
      value: 'Friday'
    },
    {
      label: 'Saturday',
      value: 'Saturday'
    },
    {
      label: 'Sunday',
      value: 'Sunday'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tracker: FormTracker
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.onlyMandatory && changes.onlyMandatory?.currentValue) {
      if (!this.dataAccessForm.get('accessTime').value) {
        this.dataAccessForm.get('serviceDescription').setValidators(Validators.required);
        this.dataAccessForm.get('serviceDescription').updateValueAndValidity();
      } else {
        this.dataAccessForm.get('serviceDescription').clearValidators();
        this.dataAccessForm.get('serviceDescription').updateValueAndValidity();
      }

      if (this.dataAccessForm.get('personalDataTransfer').value) {
        this.dataAccessForm.get('description').setValidators(Validators.required);
        this.dataAccessForm.get('description').updateValueAndValidity();
      } else {
        this.dataAccessForm.get('description').clearValidators();
        this.dataAccessForm.get('description').updateValueAndValidity();
      }
    }
  }

  ngOnInit() {
    this.dataAccessForm = this.formBuilder.group({
      canSynthetic: new FormControl(false),
      accessTime: new FormControl(false),
      serviceDescription: new FormControl(''),
      personalDataTransfer: new FormControl(true),
      description: new FormControl(''),
    });
    if (!this.dataAccessForm.get('accessTime').value) {
      this.dataAccessForm.get('serviceDescription').setValidators(Validators.required);
      this.dataAccessForm.get('serviceDescription').updateValueAndValidity();
    } else {
      this.dataAccessForm.get('serviceDescription').clearValidators();
      this.dataAccessForm.get('serviceDescription').updateValueAndValidity();
    }

    if (this.dataAccessForm.get('personalDataTransfer').value) {
      this.dataAccessForm.get('description').setValidators(Validators.required);
      this.dataAccessForm.get('description').updateValueAndValidity();
    } else {
      this.dataAccessForm.get('description').clearValidators();
      this.dataAccessForm.get('description').updateValueAndValidity();
    }

    this.tracker.tracking(this.formName, 'DataAccessComponent', this.dataAccessForm.valid);
    this.dataAccessForm.valueChanges.subscribe((value) => this.onChange(value));
    this.dataAccessForm.get('accessTime').valueChanges.subscribe((value) => {
      if (!value) {
        this.dataAccessForm.get('serviceDescription').setValidators(Validators.required);
        this.dataAccessForm.get('serviceDescription').updateValueAndValidity();
      } else {
        this.dataAccessForm.get('serviceDescription').clearValidators();
        this.dataAccessForm.get('serviceDescription').updateValueAndValidity();
      }
      this.dataAccessForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'DataAccessComponent', this.dataAccessForm.valid);
    });

    this.dataAccessForm.get('personalDataTransfer').valueChanges.subscribe((value) => {
      if (value) {
        this.dataAccessForm.get('description').setValidators(Validators.required);
        this.dataAccessForm.get('description').updateValueAndValidity();
      } else {
        this.dataAccessForm.get('description').clearValidators();
        this.dataAccessForm.get('description').updateValueAndValidity();
      }
      this.dataAccessForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'DataAccessComponent', this.dataAccessForm.valid);
    });
  }


  writeValue(value: any): void {
    this.dataAccessForm.patchValue(value || {});
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(value);
      this.tracker.tracking(this.formName, 'DataAccessComponent', this.dataAccessForm.valid);
    }
  }
}
