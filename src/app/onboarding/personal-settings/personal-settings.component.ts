import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Option } from '../interfaces';
import { Router } from '@angular/router';
import { FormTracker } from '../form-tracker';

@Component({
  templateUrl: './personal-settings.component.html',
  selector: 'personal-settings',
  styleUrls: ['./personal-settings.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PersonalSettingsComponent),
    multi: true
  }]
})
export class PersonalSettingsComponent extends Destroyable implements OnInit, ControlValueAccessor {
  @Input() onlyMandatory: boolean;
  @Input() submitted = false;
  @Input() formName: string;

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    jobTitle: new FormControl('', Validators.required),
  });

  onChangeFn: (value: any) => void;
  onTouched: () => void;
  loading: boolean;
  public roles: Option[] = [
    {
      label: 'Owner',
      value: 'owner'
    },
    {
      label: 'Admin',
      value: 'admin'
    },
    {
      label: 'Member',
      value: 'member'
    },
    {
      label: 'None',
      value: 'none'
    },
  ];

  constructor(
    public router: Router,
    private tracker: FormTracker
  ) {
    super();
  }

  writeValue(value: any): void {
    this.formGroup.patchValue(value || {});
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit() {
    this.tracker.tracking(this.formName, 'PersonalSettingsComponent', this.formGroup.valid);
    this.formGroup.valueChanges.subscribe((value) => this.onChange(value));
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(value);
      this.tracker.tracking(this.formName, 'PersonalSettingsComponent', this.formGroup.valid);
    }
  }
}
