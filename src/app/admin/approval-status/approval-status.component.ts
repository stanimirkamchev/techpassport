import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'approval-status',
  templateUrl: './approval-status.component.html',
  styleUrls: ['./approval-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovalStatusComponent implements OnInit {

  @Input() adminName: string;
  @Input() date: Date;

  constructor() { }

  ngOnInit() {
  }

}
