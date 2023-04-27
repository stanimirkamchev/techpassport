import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatCalendarHeader } from "@angular/material/datepicker";
import * as moment from 'moment';

/** Custom header component for datepicker. */
@Component({
  selector: 'example-header',
  styleUrls: ['./custom-calendar-header.component.scss'],
  template: `
<div class="mat-calendar-header">
  <div class="mat-calendar-controls">
    <button mat-button type="button" class="mat-calendar-period-button"
            (click)="currentPeriodClicked()" [attr.aria-label]="periodButtonLabel"
            cdkAriaLive="polite">
      {{periodButtonText}}
      <div class="mat-calendar-arrow"
           [class.mat-calendar-invert]="calendar.currentView != 'month'"></div>
    </button>

    <div class="mat-calendar-spacer"></div>

    <ng-content></ng-content>

    <button mat-icon-button type="button" class="mat-calendar-previous-button"
            [disabled]="!previousEnabled()" (click)="customPrev()"
            [attr.aria-label]="prevButtonLabel">
    </button>

    <button mat-icon-button type="button" class="mat-calendar-next-button"
            [disabled]="!nextEnabled()" (click)="customNext()"
            [attr.aria-label]="nextButtonLabel">
    </button>
  </div>
</div>  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CustomCalendarHeader extends MatCalendarHeader<any> {

  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
  }

  /** Handles user clicks on the previous button. */
  customPrev(): void {
    this.previousClicked();
    this.calendar.monthSelected.emit(this.calendar.activeDate)
  }

  /** Handles user clicks on the next button. */
  customNext(): void {
    this.nextClicked();
    this.calendar.monthSelected.emit(this.calendar.activeDate)
  }
}
