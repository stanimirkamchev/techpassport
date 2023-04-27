import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

export interface UiMenuOption {
  [key: string]: string;
}

@Component({
  selector: 'ui-menu',
  templateUrl: './ui-menu.component.html',
  styleUrls: ['./ui-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiMenuComponent {
  @Input() options: UiMenuOption;
  @Output() selected = new EventEmitter<string>();
}
