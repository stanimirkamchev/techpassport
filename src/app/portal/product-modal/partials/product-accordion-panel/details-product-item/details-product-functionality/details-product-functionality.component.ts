import { Component, Input, OnInit } from '@angular/core';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';
import { ProductBase } from '../../../../product-base.component';
import { Observable } from 'rxjs';

type ViewProduct = {
  details: any
  id: string
  insurance: any[]
  product: {
    createdAt: Date,
    updatedAt: Date,
    name: string,
    rapidPOC: string,
    isTraining: boolean,
    type: string[],
    description: string,
    createdBy: string,
    supplierEntry: string
    onboardingTime: number,
  }
  productCollateral: any[]
  project: any
  status: any[]
  supplier: any
  tags: {
    createdAt: Date,
    product: string,
    tags: string[],
    updatedAt: Date,
  }
};

@Component({
  selector: 'details-product-functionality',
  templateUrl: './details-product-functionality.component.html',
  styleUrls: ['./details-product-functionality.component.scss']
})
export class DetailsProductFunctionalityComponent extends ProductBase implements OnInit {
  @Input() payload: ViewProduct;
  isExpanded$: Observable<boolean>;
  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  ngOnInit(): void {
    this.isExpanded$ = this.productModalService.modalExpanded$;
  }
}
