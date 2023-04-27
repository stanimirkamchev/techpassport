import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { State } from 'src/app/admin/store';
import { selectSupplierCompliance, selectSupplierInformationSecurity } from 'src/app/admin/store/supplier/supplier.selector';
import { IAssessmentsElement } from '@services/assesment/assessment.service';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './supplier-compliance-page.component.html',
  styleUrls: ['./supplier-compliance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierCompliancePageComponent implements OnInit {

  complianceAssesment$: Observable<IAssessmentsElement[]>;
  informationSecurity$: Observable<any>;
  selectedAssesment: IAssessmentsElement;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.complianceAssesment$ = this.store.select(selectSupplierCompliance);
    this.informationSecurity$ = this.store.select(selectSupplierInformationSecurity)
      .pipe(tap(informationSecurity => this.selectedAssesment = informationSecurity));
  }

}
