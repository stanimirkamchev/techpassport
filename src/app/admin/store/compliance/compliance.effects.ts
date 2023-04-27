import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import * as fromCompliance from './compliance.actions';
import { Compliance } from './compliance.model';
import { ApiService } from '@services/api/api.service';
import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';

@Injectable()
export class ComplianceEffects {

  loadCompliances$ = createEffect(() => this.actions$
    .pipe(ofType(fromCompliance.loadCompliances))
    .pipe(switchMap(() => this.apiService.adminGetCompliances()
      .pipe(map(compliances => fromCompliance.loadCompliancesSuccess({ compliances })))
      .pipe(catchError(error => of(fromCompliance.loadCompliancesError({ error }))))
    )));

  loadComplianceDetails$ = createEffect(() => this.actions$
    .pipe(ofType(fromCompliance.loadComplianceDetails))
    .pipe(switchMap(({ id }) => forkJoin([
        this.apiService.adminGetSupplierItem(id),
        this.apiService.adminGetSupplierReview(id),
        this.apiService.adminGetSupplierProducts(id),
        this.apiService.adminGetComplianceInformationSecurity(id),
        this.apiService.adminGetComplianceChecklist(id)
      ])
      .pipe(map(([supplier, review, products, informationSecurity, assessment]) =>
         ({ supplier, review, products, informationSecurity, assessment })))
      .pipe(map(complianceDetails => fromCompliance.loadComplianceDetailsSuccess({ complianceDetails })))
      .pipe(catchError(error => of(fromCompliance.loadComplianceDetailsError({ error }))))
    )));

  downloadCompliances$ = createEffect(() => this.actions$
    .pipe(ofType(fromCompliance.downloadCompliances))
    .pipe(tap(({ compliances }) => {

      const sanitize = (desc: string) => {
        if (desc) {
          desc = desc.replace(/,/g, '\,');
          desc = desc.replace(/"/g, '""');
        } else {
          desc = '';
        }
        return desc;
      };
       return  this.csvExporter.export<Compliance>(compliances, [
          ['Supplier Name', (s) => `"${sanitize(s.supplierName)}"`],
          ['Overall Compliance', 'overallCompliance'],
          ['Security Qs', 'securityQs'],
          ['Cyber', 'cyber'],
          ['Anti-Bribery', 'antiBribery'],
          ['Sanctions', 'sanctions'],
          ['Anti-Money Laundering', 'antiMoneyLaundering'],
          ['Remuneration', 'remuneration'],
          ['Supply Chain', 'supplyChain'],
          ['Health & Safety', 'healthAndSafety'],
          ['Whistleblowing', 'whistleblowing']
        ], 'TechPassport Compliances export')
    }
    )),
    { dispatch: false });

  constructor(
    private actions$: Actions,
    private csvExporter: CsvExporterService,
    private apiService: ApiService) {}
}
