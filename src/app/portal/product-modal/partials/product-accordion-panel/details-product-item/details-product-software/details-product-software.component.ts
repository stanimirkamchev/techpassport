import { Component, Input, OnInit } from '@angular/core';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'details-product-software',
  templateUrl: './details-product-software.component.html',
  styleUrls: ['./details-product-software.component.scss']
})
export class DetailsProductSoftwareComponent extends ProductBase implements OnInit {

  @Input() payload: any;

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  ngOnInit(): void { }
}
