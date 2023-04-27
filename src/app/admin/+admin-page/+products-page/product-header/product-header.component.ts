import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'product-header',
  templateUrl: './product-header.component.html',
  styleUrls: ['./product-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
