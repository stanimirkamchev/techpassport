import {
  Component,
  OnInit,
  forwardRef
} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  templateUrl: './auditing-experience.component.html',
  selector: 'auditing-experience',
  styleUrls: ['./auditing-experience.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AuditingExperienceComponent),
    multi: true
  }]
})
export class AuditingExperienceComponent extends Destroyable implements OnInit, ControlValueAccessor {
  columns = [
    {
      label: '',
      value: 'sector'
    },
    {
      label: 'POC only',
      value: 'poc'
    },
    {
      label: 'Service agreements',
      value: 'serviceAgreements'
    },
    {
      label: 'Regional MSA',
      value: 'regional'
    },
    {
      label: 'Global MSA',
      value: 'global'
    }
  ];

  data = [
    {
      sector: 'Banking - Tier 1'
    },
    {
      sector: 'Banking - Tier 2'
    },
    {
      sector: 'Banking - Tier 3'
    },
    {
      sector: 'Insurance'
    },
    {
      sector: 'Wealth Management'
    },
    {
      sector: 'Life Assurance '
    },
    {
      sector: 'Asset Management'
    },
  ];
  onChangeFn: Function;
  onTouched: Function;

  constructor(
    public router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.data.forEach(t => {
      this.columns.forEach((col: any) => {
        if (col.value !== 'sector') {
          t[col.value] = '';
        }
      });
    });
  }

  writeValue(value: any): void {
    value = value || [];
    value.forEach(ex => {
      const data = this.data.find(t => t.sector === ex.sector);
      if (data) {
        this.columns.forEach((col: any) => {
          if (col.value !== 'sector') {
            data[col.value] = ex[col.value];
          }
        });
      }
    });
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(this.data);
    }
  }
}
