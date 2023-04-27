import { Injectable } from '@angular/core';
import { ProductModalService } from './service/product-modal.service';

@Injectable()
export abstract class ProductBase {

  constructor(public productModalService: ProductModalService) {
    this.productModalService.modalExpanded$.subscribe(data => this.modalExpanded = data);
  }

  public modalExpanded = false;
  public expansionStyling = () => this.productModalService.expansionStyling();

  public setIcon(key: string) {
    switch (key) {
      case 'yes':
        return 'check_circle';
      case 'no':
        return 'add_circle';
      default:
        return 'add_circle';
    }
  }
}
