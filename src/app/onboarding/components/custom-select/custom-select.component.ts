import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { SPACE } from '@angular/cdk/keycodes';

export interface IOption {
  label: string;
  value: string;
  children?: IOption[];
}

@Component({
  templateUrl: './custom-select.component.html',
  selector: 'app-custom-select',
  styleUrls: ['./custom-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() set submitted(submitted: boolean) {
    if (submitted) {
      this.formGroup.get(this.formControlName).setValidators([this.maxLengthArray(3), this.minLengthArray(1)]);
      this.formGroup.get(this.formControlName).updateValueAndValidity();
    }
  }
  @Input() formControlName?: string;
  @Input() formGroup?: FormGroup;
  @Input() isError: boolean;
  @Input() errorText: string;
  @Input() options: IOption[];
  @Input() title: string;
  @Input() useValidation = false;
  @Input() multiple: boolean;
  @Input() group: boolean;
  @Input() enableNewButton = false;
  @Input() enableSearchBox = false;
  @Input() disabled = false;
  @Output() onAddNew = new EventEmitter();

  disable = false;
  filter = new FormControl('');
  constructor(public router: Router, private cdRef: ChangeDetectorRef) {
    super();
  }

  filteredData = new BehaviorSubject([]);

  get filteredOptions() {
    if (this.enableSearchBox && this.filter.value) {
      return this.filteredData.getValue();
    } else {
      return this.options;
    }
  }

  ngOnInit() {
    if (this.useValidation) {
      this.formGroup.get(this.formControlName).setValidators([this.maxLengthArray(3)]);
    }
    this.filter.valueChanges.pipe(
      debounceTime(500),
      map(value => this._filter(cloneDeep(this.options), value)),
    ).subscribe(res => {
      this.filteredData.next(res);
      this.cdRef.detectChanges();
    });

    this.formGroup.get(this.formControlName).valueChanges.subscribe((val: any[]) => {
      this.disable = val && val.length > 3;
    });

  }

  private _filter(arr: any[], value: string): any[] {
    const filterValue = value.toLowerCase();
    for (const item of arr) {
      if (item.children && item.children.length) {
        this._filter(item.children, value);
      }
      if (!(item.children && item.children.filter(t => !t.invisible).length) && !item.label.toLowerCase().includes(filterValue)) {
        item.invisible = true;
      }
    }
    return arr;
  }

  keydown(event) {
    if (event.keyCode === SPACE) {
      this.filter.setValue(this.filter.value + ' ');
      event.stopPropagation();
    }
  }

  onSelectionChange(event) {
    if (event.isUserInput && this.group && event.source._selected) {
      const current = (this.filteredOptions as any).flatMap(t => t.children).find(t => t.value === event.source.value);
      if (this.formGroup && current && current.children && current.children.length) {
        this.formGroup.get(this.formControlName)
          .setValue(
            [
              ...this.formGroup.get(this.formControlName).value,
              ...current.children.filter(t => !t.invisible).map(t => t.value)
            ]
          );
        this.cdRef.detectChanges();
      }
    }
  }

  addNew() {
    this.onAddNew.emit();
  }

  isDisabled(val: any) {
    if (!this.useValidation) {
      return false;
    }
    const formValuess: string[] = this.formGroup.get(this.formControlName).value;
    if (formValuess && formValuess.length > 0) {
      return this.disable && !formValuess.includes(val.value);
    }

    return false;
  }

  maxLengthArray(max: number) {
    if (!this.useValidation) {
      return null;
    }
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value.length <= max) {
        this.isError = false;
        this.errorText = null;
        return null;
      }
      this.isError = true;
      this.errorText = 'Choose up to three taxonomies';

      return { MaxLengthArray: true };
    };
  }

  minLengthArray(min: number) {
    if (!this.useValidation) {
      return null;
    }
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value && c.value.length < min) {
        this.isError = true;
        this.errorText = 'Choose at least one taxonomy';
        return { MinLengthArray: true };
      }
      this.isError = false;
      this.errorText = null;
      return null;
    };
  }
}
