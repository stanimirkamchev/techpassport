import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { State } from 'src/app/admin/store';
import { IAssessmentsElement } from '@services/assesment/assessment.service';
import { selectProductCompliance, selectProductInformationSecurity } from 'src/app/admin/store/product/product.selector';

@Component({
  templateUrl: './product-compliance-page.component.html',
  styleUrls: ['./product-compliance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCompliancePageComponent implements OnInit {

  complianceAssesment$: Observable<IAssessmentsElement[]>;
  informationSecurity$: Observable<any>;
  selectedAssesment: IAssessmentsElement;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.complianceAssesment$ = this.store.select(selectProductCompliance);
    this.informationSecurity$ = this.store.select(selectProductInformationSecurity)
      .pipe(tap(informationSecurity => this.selectedAssesment = informationSecurity));
  }
}
