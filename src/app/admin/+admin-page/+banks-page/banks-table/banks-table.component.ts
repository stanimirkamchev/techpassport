import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { getName } from 'country-list';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { Selectable } from '@abstract/selectable';
import { Customer, CustomerStatus } from 'src/app/admin/store/customer/customer.model';
import { ApiService } from '@services/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'banks-table',
  templateUrl: './banks-table.component.html',
  styleUrls: ['./banks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BanksTableComponent extends Selectable<Customer> {

  @Input() customers: Customer[];
  @Output() sort = new EventEmitter<Sort>();
  @Output() edit = new EventEmitter<Customer>();
  @Output() changeSaml = new EventEmitter<{ event: Event, element: any }>();

  CustomerStatus = CustomerStatus;
  getName = getName;
  getUnicodeFlagIcon = getUnicodeFlagIcon;

  displayedColumns = ['name', 'companyNumber', 'createdAt', 'status', 'country', 'actions', 'isSamlAuthenticated'];

  constructor(protected elementRef: ElementRef, public apiService: ApiService, private snackBar: MatSnackBar) {
    super(elementRef);
  }

  ngOnInit() {
    if(this.customers && this.customers.length > 0) {
      this.customers = this.customers.map((item) => ({
        ...item,
        isSamlAuthenticated: item.isSamlAuthenticated ? item.isSamlAuthenticated : false
      }))
    }
  }

  openSnackBar(name: string, state: any) {
    const message = `You have changed authentication status of ${name} to ${state}`;
    this.snackBar.open(message, 'success', {
      duration: 2000,
      panelClass: 'snckbar'
    });
  }

  onChangeSAML(event, element) {
    this.changeSaml.emit({ event, element });
    this.openSnackBar(element.name, event.checked);
  }
}
