import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'ui-select',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSelectComponent implements OnInit {

  @Input() value: string;

  constructor() { }

  ngOnInit() {
  }

}
