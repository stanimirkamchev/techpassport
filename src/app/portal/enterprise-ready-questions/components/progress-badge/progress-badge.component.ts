import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-badge',
  templateUrl: './progress-badge.component.html',
  styleUrls: ['./progress-badge.component.scss']
})
export class ProgressBadgeComponent implements OnInit {

  @Input() completed: number;
  @Input() compliant: number;

  constructor() { }

  ngOnInit(): void { }

}
