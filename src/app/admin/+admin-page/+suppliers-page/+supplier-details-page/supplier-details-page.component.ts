import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { SupplierDetails, Supplier } from 'src/app/admin/store/supplier/supplier.model';
import { State } from 'src/app/admin/store';
import { loadSupplierDetails, downloadSupplier, approveSupplier, rejectSupplier, addSupplierProduct, editSupplierCompliance } from 'src/app/admin/store/supplier/supplier.actions';
import { selectSupplierDetails, selectSupplierDetailsLoading } from 'src/app/admin/store/supplier/supplier.selector';

@Component({
  selector: 'app-supplier-details-page',
  templateUrl: './supplier-details-page.component.html',
  styleUrls: ['./supplier-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierDetailsPageComponent implements OnInit {

  supplierDetails$: Observable<SupplierDetails>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<State>,
    public router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.store.dispatch(loadSupplierDetails({ id: this.activatedRoute.snapshot.params.id }));
    this.loading$ = this.store.select(selectSupplierDetailsLoading);
    this.supplierDetails$ = this.store.select(selectSupplierDetails);
  }

  download(supplier: Supplier) {
    this.store.dispatch(downloadSupplier({ id: supplier._id }));
  }

  approve(supplier: Supplier) {
    this.store.dispatch(approveSupplier({ supplier }));
  }

  reject(supplier: Supplier) {
    this.store.dispatch(rejectSupplier({ supplier }));
  }

  addProduct(supplier: Supplier) {
    this.store.dispatch(addSupplierProduct({ supplier }));
  }

  compliance(supplier: Supplier) {
    this.store.dispatch(editSupplierCompliance({ supplier }));
  }
}
