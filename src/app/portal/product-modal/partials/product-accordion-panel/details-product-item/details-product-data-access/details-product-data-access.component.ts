import { Component, Input, OnInit } from '@angular/core';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';
import { ProductBase } from '../../../../product-base.component';
@Component({
  selector: 'details-product-data-access',
  templateUrl: './details-product-data-access.component.html',
  styleUrls: ['./details-product-data-access.component.scss']
})
export class DetailsProductDataAccessComponent extends ProductBase implements OnInit {

  @Input() payload: any;

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  ngOnInit(): void { }
}
