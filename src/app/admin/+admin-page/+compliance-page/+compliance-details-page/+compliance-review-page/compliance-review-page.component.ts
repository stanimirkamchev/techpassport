import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { IAssessmentsElement } from '@services/assesment/assessment.service';
import { State } from 'src/app/admin/store';
import { selectComplianceAssessment, selectComplianceInformationSecurity } from 'src/app/admin/store/compliance/compliance.selector';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './compliance-review-page.component.html',
  styleUrls: ['./compliance-review-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplianceReviewPageComponent implements OnInit {

  complianceAssesment$: Observable<IAssessmentsElement[]>;
  informationSecurity$: Observable<any>;
  selectedAssesment: IAssessmentsElement;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.complianceAssesment$ = this.store.select(selectComplianceAssessment);
    this.informationSecurity$ = this.store.select(selectComplianceInformationSecurity)
      .pipe(tap(informationSecurity => this.selectedAssesment = informationSecurity));
  }
}
