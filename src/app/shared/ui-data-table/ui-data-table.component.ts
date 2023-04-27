import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-data-table',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ui-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDataTableComponent {}
