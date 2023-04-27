import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-page-close',
  templateUrl: './ui-page-close.component.html',
  styleUrls: ['./ui-page-close.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiPageCloseComponent {

  @Input() route: string;

  constructor(private router: Router) {}

  close() {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }
}
