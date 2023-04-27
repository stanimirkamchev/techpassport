import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { IAssessmentsElement } from '@services/assesment/assessment.service';

@Component({
  selector: 'compliance-assessment-item',
  templateUrl: './compliance-assessment-item.component.html',
  styleUrls: ['./compliance-assessment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceAssessmentItemComponent implements OnInit {
  @Input() assessmentItem: IAssessmentsElement;
  @Input() downloadDisabled: boolean;

  constructor() {}

  ngOnInit() {}
}
