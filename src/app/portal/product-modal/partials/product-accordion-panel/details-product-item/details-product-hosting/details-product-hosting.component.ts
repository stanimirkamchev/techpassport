import { Component, Input, OnInit } from '@angular/core';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'details-product-hosting',
  templateUrl: './details-product-hosting.component.html',
  styleUrls: ['./details-product-hosting.component.scss']
})
export class DetailsProductHostingComponent extends ProductBase implements OnInit {
  @Input() payload: any;

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  ngOnInit(): void { }
}
