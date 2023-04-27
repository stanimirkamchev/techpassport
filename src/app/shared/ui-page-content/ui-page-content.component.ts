import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-page-content',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ui-page-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiPageContentComponent {}
