import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-drawer',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ui-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDrawerComponent {}
