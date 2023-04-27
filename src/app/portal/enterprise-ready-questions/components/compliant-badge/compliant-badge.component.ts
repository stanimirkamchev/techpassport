import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'compliant-badge',
  templateUrl: './compliant-badge.component.html',
  styleUrls: ['./compliant-badge.component.scss']
})
export class CompliantBadgeComponent implements OnInit {

  @Input() compliant: number;

  constructor() { }

  ngOnInit(): void { }

}
