import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBase } from '../../../product-base.component';
import { ProductModalService } from '../../../service/product-modal.service';

@Component({
  selector: 'details-product-item',
  templateUrl: './details-product-item.component.html',
  styleUrls: ['./details-product-item.component.scss']
})
export class DetailsProductItemComponent extends ProductBase implements OnInit {
  isExpanded$: Observable<boolean>;
  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: {};

  public expandedTabs: {} = {
    functionality: false,
    dataAccess: false,
    hosting: false,
    charges: false,
    software: false,
    useCase: false,
  };

  ngOnInit(): void {
    this.isExpanded$ = this.productModalService.modalExpanded$;
  }

  // follows modal expansion and sets css class accordingly
  modalWindowExpansion = () => this.productModalService.modalWindowExpansion();
}
