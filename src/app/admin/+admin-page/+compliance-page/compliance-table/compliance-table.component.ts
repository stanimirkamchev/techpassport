import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Sort } from '@angular/material/sort';
import { Compliance, complianceProps } from 'src/app/admin/store/compliance/compliance.model';
import { Selectable } from '@abstract/selectable';

@Component({
  selector: 'compliance-table',
  templateUrl: './compliance-table.component.html',
  styleUrls: ['./compliance-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplianceTableComponent extends Selectable<Compliance> {

  @Input() compliances: Compliance[];
  @Output() sort = new EventEmitter<Sort>();

  complianceProps = complianceProps;
  displayedColumns = [
    'supplierName', 'overallCompliance', 'securityQs', 'cyber',
    'antiBribery', 'sanctions', 'antiMoneyLaundering', 'remuneration',
    'supplyChain', 'healthAndSafety', 'whistleblowing'];

  constructor(private router: Router, protected elementRef: ElementRef) {
    super(elementRef);
  }

  openDetails(item: Compliance) {
    this.router.navigate([`/admin/compliance/${item._id}`]);
  }
}
