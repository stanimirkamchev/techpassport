import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'description-info',
  templateUrl: './description-info.component.html',
  styleUrls: ['./description-info.component.scss']
})
export class DescriptionInfoComponent implements OnInit {

  constructor() { }

  @Input() description: string;

  ngOnInit(): void {
  }
}
