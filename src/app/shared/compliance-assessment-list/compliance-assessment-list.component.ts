import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { IAssessmentsElement } from '@services/assesment/assessment.service';

@Component({
  selector: 'compliance-assessment-list',
  templateUrl: './compliance-assessment-list.component.html',
  styleUrls: ['./compliance-assessment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplianceAssessmentListComponent implements OnInit {

  @Input() assessmentList: IAssessmentsElement[];
  @Input() informationSecurity: any;
  @Input() selectedId: string;
  @Output() selectAssessment = new EventEmitter<IAssessmentsElement>();

  constructor() { }

  ngOnInit() {
  }
}
