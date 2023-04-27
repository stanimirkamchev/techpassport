import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddFrameworkModalComponent } from '../add-framework-modal/add-framework-modal.component';
import { FormTracker } from '../../form-tracker';

@Component({
  templateUrl: './application-software.component.html',
  selector: 'application-software',
  styleUrls: ['./application-software.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ApplicationSoftwareComponent),
    multi: true
  }]
})
export class ApplicationSoftwareComponent extends Destroyable implements OnInit, OnChanges, ControlValueAccessor {
  applicationSoftwareForm: FormGroup;
  onChangeFn: Function;
  onTouched: Function;

  hostOptions = [];
  @Input() submitted = false;
  @Input() formName: string;
  @Input() onlyMandatory: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private dialog: MatDialog,
    private tracker: FormTracker,

  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.onlyMandatory && changes.onlyMandatory?.currentValue) {
      if (this.applicationSoftwareForm.get('openSource').value) {
        this.applicationSoftwareForm.get('details').setValidators(Validators.required);
        this.applicationSoftwareForm.get('details').updateValueAndValidity();
      } else {
        this.applicationSoftwareForm.get('details').clearValidators();
        this.applicationSoftwareForm.get('details').updateValueAndValidity();
      }

      if (this.applicationSoftwareForm.get('thirdPartyTester').value) {
        this.applicationSoftwareForm.get('moreInfo').setValidators(Validators.required);
        this.applicationSoftwareForm.get('moreInfo').updateValueAndValidity();
      } else {
        this.applicationSoftwareForm.get('moreInfo').clearValidators();
        this.applicationSoftwareForm.get('moreInfo').updateValueAndValidity();
      }
    }
  }

  ngOnInit() {
    this.applicationSoftwareForm = this.formBuilder.group({
      frameworks: new FormControl([], [Validators.required]),
      openSource: new FormControl(false),
      details: new FormControl(''),
      thirdParty: new FormControl(true),
      thirdDetails: new FormControl('', [Validators.required]),
      thirdPartyTester: new FormControl(true),
      moreInfo: new FormControl(''),
    });
    if (this.applicationSoftwareForm.get('openSource').value) {
      this.applicationSoftwareForm.get('details').setValidators(Validators.required);
      this.applicationSoftwareForm.get('details').updateValueAndValidity();
    } else {
      this.applicationSoftwareForm.get('details').clearValidators();
      this.applicationSoftwareForm.get('details').updateValueAndValidity();
    }

    if (this.applicationSoftwareForm.get('thirdPartyTester').value) {
      this.applicationSoftwareForm.get('moreInfo').setValidators(Validators.required);
      this.applicationSoftwareForm.get('moreInfo').updateValueAndValidity();
    } else {
      this.applicationSoftwareForm.get('moreInfo').clearValidators();
      this.applicationSoftwareForm.get('moreInfo').updateValueAndValidity();
    }
    this.tracker.tracking(this.formName, 'ApplicationSoftwareComponent', this.applicationSoftwareForm.valid);
    this.applicationSoftwareForm.valueChanges.subscribe((value) => this.onChange(value));
    this.loadFrameworks();
    this.applicationSoftwareForm.get('openSource').valueChanges.subscribe((value) => {
      if (value) {
        this.applicationSoftwareForm.get('details').setValidators(Validators.required);
        this.applicationSoftwareForm.get('details').updateValueAndValidity();
      } else {
        this.applicationSoftwareForm.get('details').clearValidators();
        this.applicationSoftwareForm.get('details').updateValueAndValidity();
      }
      this.applicationSoftwareForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'ApplicationSoftwareComponent', this.applicationSoftwareForm.valid);
    });

    this.applicationSoftwareForm.get('thirdParty').valueChanges.subscribe((value) => {
      if (value) {
        this.applicationSoftwareForm.get('thirdDetails').setValidators(Validators.required);
        this.applicationSoftwareForm.get('thirdDetails').updateValueAndValidity();
      } else {
        this.applicationSoftwareForm.get('thirdDetails').clearValidators();
        this.applicationSoftwareForm.get('thirdDetails').updateValueAndValidity();
      }
      this.applicationSoftwareForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'ApplicationSoftwareComponent', this.applicationSoftwareForm.valid);
    });

    this.applicationSoftwareForm.get('thirdPartyTester').valueChanges.subscribe((value) => {
      if (value) {
        this.applicationSoftwareForm.get('moreInfo').setValidators(Validators.required);
        this.applicationSoftwareForm.get('moreInfo').updateValueAndValidity();
      } else {
        this.applicationSoftwareForm.get('moreInfo').clearValidators();
        this.applicationSoftwareForm.get('moreInfo').updateValueAndValidity();
      }
      this.applicationSoftwareForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'ApplicationSoftwareComponent', this.applicationSoftwareForm.valid);
    });
  }

  writeValue(value: any): void {
    this.applicationSoftwareForm.patchValue(value || {});
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
      this.tracker.tracking(this.formName, 'ApplicationSoftwareComponent', this.applicationSoftwareForm.valid);
    }
  }

  loadFrameworks() {
    this.apiService.searchFrameworks('').subscribe(res => {
      this.hostOptions = [...res.body.map(t => ({ label: t.name, value: t.name })), { label: 'Other', value: 'Other' }];
    });
  }

  onNewFramework(event) {
    this.dialog.open(AddFrameworkModalComponent, {
      height: '300px',
      width: '600px',
      panelClass: 'custom-container'
    }).afterClosed().subscribe(result => {
      if (result) {
        // this.isAddingSolution = true
        this.apiService.addFramework(result.name).subscribe(res => {
          // this.isAddingSolution = false
          this.loadFrameworks();
          this.applicationSoftwareForm.get('frameworks').setValue([...this.applicationSoftwareForm.get('frameworks').value, result.name]);
        });
      }
    });
  }

}
