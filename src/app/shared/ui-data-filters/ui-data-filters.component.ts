import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-data-filters',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./ui-data-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDataFiltersComponent {}
