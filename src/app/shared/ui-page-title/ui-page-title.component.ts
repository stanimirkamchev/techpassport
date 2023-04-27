import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-page-title',
  templateUrl: './ui-page-title.component.html',
  styleUrls: ['./ui-page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiPageTitleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
