import { Component, Input, OnInit } from '@angular/core';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'details-product-usecase',
  templateUrl: './details-product-usecase.component.html',
  styleUrls: ['./details-product-usecase.component.scss']
})
export class DetailsProductUsecaseComponent extends ProductBase implements OnInit {

  @Input() payload: any;

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }
  ngOnInit(): void { }
}
