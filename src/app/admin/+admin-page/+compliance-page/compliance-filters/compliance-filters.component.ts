import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime, debounceTime } from 'rxjs/operators';

import { ComplianceFilters, Compliance, complianceProps } from 'src/app/admin/store/compliance/compliance.model';
import { OnboardingStatus } from 'src/app/admin/store/supplier/supplier.model';
import { filterDebounce } from '@models/filters';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'compliance-filters',
  templateUrl: './compliance-filters.component.html',
  styleUrls: ['./compliance-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplianceFiltersComponent implements OnInit, OnDestroy {

  @Input() set compliances(compliances: Compliance[]) {
    // this.admins = [... new Set((compliances || []).map(c => c.adminReviewer))];
  }
  @Output() filter = new EventEmitter<ComplianceFilters>();

  onboardingStatuses = OnboardingStatus;
  admins: string[] = [];
  complianceProps = complianceProps;

  formGroup = new FormGroup({
    onboardingStatus: new FormControl(''),
    adminReviewer: new FormControl(''),
    search: new FormControl(''),
    sort: new FormControl('')
  });

  private destroyed$ = new Subject();

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(filterDebounce))
      .subscribe(filters => this.filter.emit(filters));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
