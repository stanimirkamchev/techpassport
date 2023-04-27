import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rejection-status',
  templateUrl: './rejection-status.component.html',
  styleUrls: ['./rejection-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RejectionStatusComponent implements OnInit {

  @Input() adminName: string;
  @Input() date: Date;

  @Output() details = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
