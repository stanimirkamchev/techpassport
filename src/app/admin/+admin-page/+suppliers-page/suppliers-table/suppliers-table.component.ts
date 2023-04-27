import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { Supplier, OptInStatus, SupplierStatus, OnboardingStatus, SupplierMembership } from 'src/app/admin/store/supplier/supplier.model';
import { Selectable } from '@abstract/selectable';

@Component({
  selector: 'suppliers-table',
  templateUrl: './suppliers-table.component.html',
  styleUrls: ['./suppliers-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuppliersTableComponent extends Selectable<Supplier> {

  @Input() suppliers: Supplier[];
  @Output() sort = new EventEmitter<Sort>();

  optInStatus = OptInStatus;
  supplierStatus = SupplierStatus;
  onboardingStatus = OnboardingStatus;
  supplierMembership = SupplierMembership;

  displayedColumns = [
    'onboardingStatus', 'updatedAt', 'name',
    'owner.displayName', 'owner.phone', 'createdAt', 'numberOfUsers', 'members',
    'optIn', 'numberOfProductsApproved', 'numberOfProducts', 'status',
    'review.displayName', 'review.date'];

  constructor(private router: Router, protected elementRef: ElementRef) {
    super(elementRef);
  }

  openDetails(item: Supplier) {
    this.router.navigate([`/admin/suppliers/${item._id}`]);
  }
}
