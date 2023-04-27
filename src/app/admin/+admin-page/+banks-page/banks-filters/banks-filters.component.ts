import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Destroyable } from '@abstract/destroyable';
import { CustomersFilters, Customer, CustomerStatus } from 'src/app/admin/store/customer/customer.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { filterDebounce } from '@models/filters';

@Component({
  selector: 'banks-filters',
  templateUrl: './banks-filters.component.html',
  styleUrls: ['./banks-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BanksFiltersComponent extends Destroyable implements OnInit {

  @Input() set filters(filters: CustomersFilters) {
    this.formGroup.patchValue(filters, { emitEvent: false });
  }
  @Input() set customers(customers: Customer[]) {
    this.customerStatuses = [...new Set(customers.map(({ status }) => status))];
  }
  @Output() filter = new EventEmitter<CustomersFilters>();

  CustomerStatus = CustomerStatus;
  customerStatuses: string[];

  formGroup = new FormGroup({
    status: new FormControl(''),
    tag: new FormControl(''),
    reviewer: new FormControl(''),
    sort: new FormControl(''),
    search: new FormControl('')
  });

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(filterDebounce))
      .subscribe(filters => this.filter.emit(filters));
  }
}
