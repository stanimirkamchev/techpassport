import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-page-header',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ui-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiPageHeaderComponent {}
