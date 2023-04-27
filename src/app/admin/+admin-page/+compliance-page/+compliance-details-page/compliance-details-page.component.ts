import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplianceDetails, Compliance } from 'src/app/admin/store/compliance/compliance.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/admin/store';
import { Router, ActivatedRoute } from '@angular/router';
import { loadComplianceDetails } from 'src/app/admin/store/compliance/compliance.actions';
import { selectComplianceDetailsLoading, selectComplianceDetails } from 'src/app/admin/store/compliance/compliance.selector';

@Component({
  selector: 'app-compliance-details-page',
  templateUrl: './compliance-details-page.component.html',
  styleUrls: ['./compliance-details-page.component.scss']
})
export class ComplianceDetailsPageComponent implements OnInit {

  loading$: Observable<boolean>;
  complianceDetails$: Observable<ComplianceDetails>;

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.store.dispatch(loadComplianceDetails({ id: this.activatedRoute.snapshot.params.id }));
    this.loading$ = this.store.select(selectComplianceDetailsLoading);
    this.complianceDetails$ = this.store.select(selectComplianceDetails);
  }

  download(compliance: Compliance) {
    // this.store.dispatch(downloadCompliance({ compliance }));
  }

  approve(compliance: Compliance) {
    // this.store.dispatch(approveCompliance({ compliance }));
  }

  reject(compliance: Compliance) {
    // this.store.dispatch(rejectCompliance({ compliance }));
  }

}
