import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SuppliersFilters, SupplierStatus, Supplier, OptInStatus } from 'src/app/admin/store/supplier/supplier.model';
import { filterDebounce } from '@models/filters';

@Component({
  selector: 'suppliers-filters',
  templateUrl: './suppliers-filters.component.html',
  styleUrls: ['./suppliers-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuppliersFiltersComponent implements OnInit, OnDestroy {

  @Input() set filters(filters: SuppliersFilters) {
    this.formGroup.patchValue(filters, { emitEvent: false });
  }
  @Input() set suppliers(suppliers: Supplier[]) {
    this.supplierStatuses = [...new Set(suppliers.map(({ status }) => SupplierStatus[status]))];
    this.optInStatuses = [...new Set(suppliers.map(({ optIn }) => OptInStatus[optIn]))];
  }
  @Input() set sort(sort: Sort) {
    this.formGroup.get('sort').setValue(sort, { onlySelf: true });
  }
  @Output() filter = new EventEmitter<SuppliersFilters>();
  @Output() viewInvitations = new EventEmitter<any>();

  supplierStatuses: SupplierStatus[];
  optInStatuses: OptInStatus[];

  formGroup = new FormGroup({
    supplierStatus: new FormControl(''),
    optInStatus: new FormControl(''),
    sort: new FormControl(''),
    search: new FormControl('')
  });

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

  onViewInvitations() {
    this.viewInvitations.emit();
  }
}
