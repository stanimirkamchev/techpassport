import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header-controls',
  templateUrl: './header-controls.component.html',
  styleUrls: ['./header-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderControlsComponent {

  @Input() approvalDisabled: boolean;
  @Input() approvalHidden: boolean;
  @Input() downloadDisabled: boolean;
  @Input() downloadHidden: boolean;

  @Output() download = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() approve = new EventEmitter();
}
