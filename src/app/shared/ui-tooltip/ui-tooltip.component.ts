import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-tooltip',
  templateUrl: './ui-tooltip.component.html',
  styleUrls: ['./ui-tooltip.component.scss']
})
export class UiTooltipComponent implements OnInit {

  @Input() htmlContent: string;

  constructor() { }

  ngOnInit(): void { }

}
