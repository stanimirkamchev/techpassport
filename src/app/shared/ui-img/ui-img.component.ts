import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'ui-img',
  templateUrl: './ui-img.component.html',
  styleUrls: ['./ui-img.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiImgComponent {
  hidden = true;

  @Input() src: string;

  onError() {
    this.hidden = true;
  }

  onLoad() {
    this.hidden = false;
  }

}
