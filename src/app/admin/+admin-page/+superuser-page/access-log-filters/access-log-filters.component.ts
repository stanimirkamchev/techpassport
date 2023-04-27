import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { filterDebounce } from '@models/filters';

import { AccessLog, AccessLogFilters } from 'src/app/admin/store/superuser/superuser.model';

@Component({
  selector: 'access-log-filters',
  templateUrl: './access-log-filters.component.html',
  styleUrls: ['./access-log-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessLogFiltersComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;
  @Input() set filters(filters: AccessLogFilters) {
    this.formGroup.patchValue(filters, { emitEvent: false });
  }
  @Input() set accessLog(accessLog: AccessLog[]) {
    this.displayNames = [...new Set((accessLog || []).map(c => c.user.displayName))];
    this.companyNames = [...new Set((accessLog || []).map(c => c.user.company))];
    this.userStatuses = [...new Set((accessLog || []).map(c => c.user.status))];
    this.sessionStatuses = [...new Set((accessLog || []).map(c => c.status))];
    this.emails = [...new Set((accessLog || []).map(c => c.user.email))];
  }

  @Output() filter = new EventEmitter<AccessLogFilters>();
  @Output() refresh = new EventEmitter();
  @Output() download = new EventEmitter();

  formGroup = new FormGroup({
    search: new FormControl(''),
    displayName: new FormControl(''),
    companyName: new FormControl(''),
    userStatus: new FormControl(''),
    sessionStatus: new FormControl(''),
    email: new FormControl('')
  });

  displayNames: string[] = [];
  companyNames: string[] = [];
  userStatuses: string[] = [];
  sessionStatuses: string[] = [];
  emails: string[] = [];

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
