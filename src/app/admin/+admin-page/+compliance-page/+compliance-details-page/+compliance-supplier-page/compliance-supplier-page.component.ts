import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { SupplierReview } from 'src/app/admin/store/supplier/supplier.model';
import { State } from 'src/app/admin/store';
import { selectComplianceSupplierReview } from 'src/app/admin/store/compliance/compliance.selector';

@Component({
  templateUrl: './compliance-supplier-page.component.html',
  styleUrls: ['./compliance-supplier-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplianceSupplierPageComponent implements OnInit {

  supplierReview$: Observable<SupplierReview>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.supplierReview$ = this.store.select(selectComplianceSupplierReview);
  }

}
