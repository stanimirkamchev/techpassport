import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-action-buttons',
  templateUrl: './step-action-buttons.component.html',
  styleUrls: ['./step-action-buttons.component.scss']
})
export class StepActionButtonsComponent implements OnInit {

  @Input() primaryButtonText = 'Continue';
  @Input() secondaryButtonText = 'Cancel';

  @Input() position: 'left' | 'right' = 'right';

  @Output() PrimaryClicked: EventEmitter<void> = new EventEmitter();
  @Output() SecondaryClicked: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  onPrimaryButtonClicked(): void {
    this.PrimaryClicked.emit();
  }

  onSecondaryButtonClicked(): void {
    this.SecondaryClicked.emit();
  }
}
