import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { filterDebounce } from '@models/filters';
import { AccessManagement, AccessManagementFilters } from 'src/app/admin/store/superuser/superuser.model';

@Component({
  selector: 'access-management-filters',
  templateUrl: './access-management-filters.component.html',
  styleUrls: ['./access-management-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessManagementFiltersComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;
  @Input() set filters(filters: AccessManagementFilters) {
    this.formGroup.patchValue(filters, { emitEvent: false });
  }
  @Input() set accessManagement(accessManagement: AccessManagement[]) {
    this.roles = [... new Set((accessManagement || []).map(c => c.role))];
    this.types = [... new Set((accessManagement || []).map(c => c.type))];
    this.companies = [... new Set((accessManagement || []).map(c => c.company))];
  }

  @Output() filter = new EventEmitter<AccessManagementFilters>();
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
