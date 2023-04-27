import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { ErrorHandlingFilters, ErrorHandling } from 'src/app/admin/store/superuser/superuser.model';
import { filterDebounce } from '@models/filters';

@Component({
  selector: 'error-handling-filters',
  templateUrl: './error-handling-filters.component.html',
  styleUrls: ['./error-handling-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorHandlingFiltersComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;
  @Input() set filters(filters: ErrorHandlingFilters) {
    this.formGroup.patchValue(filters, { emitEvent: false });
  }
  @Input() set errorHandling(errorHandling: ErrorHandling[]) {
    // this.roles = [... new Set((errorHandling || []).map(c => c.role))];
    // this.types = [... new Set((errorHandling || []).map(c => c.type))];
    // this.companies = [... new Set((errorHandling || []).map(c => c.company))];
  }

  @Output() filter = new EventEmitter<ErrorHandlingFilters>();
  @Output() refresh = new EventEmitter();
  @Output() download = new EventEmitter();

  formGroup = new FormGroup({
    search: new FormControl(''),
    role: new FormControl(''),
    type: new FormControl(''),
    company: new FormControl('')
  });

  roles: string[] = [];
  types: string[] = [];
  companies: string[] = [];

  private destroyed$ = new Subject();

  constructor() { }

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
