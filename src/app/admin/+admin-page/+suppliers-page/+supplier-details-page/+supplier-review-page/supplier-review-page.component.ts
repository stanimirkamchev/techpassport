import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from 'src/app/admin/store';
import { SupplierDetails, Supplier } from 'src/app/admin/store/supplier/supplier.model';
import { selectSupplierDetails } from 'src/app/admin/store/supplier/supplier.selector';
import { showRejectionDetails } from 'src/app/admin/store/supplier/supplier.actions';

@Component({
  templateUrl: './supplier-review-page.component.html',
  styleUrls: ['./supplier-review-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierReviewPageComponent implements OnInit {

  supplierDetails$: Observable<SupplierDetails>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.supplierDetails$ = this.store.select(selectSupplierDetails);
  }

  showRejectionDetails(supplier: Supplier) {
    this.store.dispatch(showRejectionDetails({ supplier }));
  }
}
