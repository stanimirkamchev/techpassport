import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBase } from '../../../product-base.component';
import { ProductModalService } from '../../../service/product-modal.service';

@Component({
  selector: 'company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent extends ProductBase implements OnInit {

  @Input() payload: any;
  isExpanded$: Observable<boolean>;

  supplier: any;
  product: any;

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  ngOnInit(): void {
    this.supplier = this.payload.supplier;
    this.product = this.payload.product;
    this.isExpanded$ = this.productModalService.modalExpanded$;
  }

}
