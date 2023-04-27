import { Component, OnInit, Input } from '@angular/core';
import { ProductBase } from '../../product-base.component';
import { ProductModalService } from '../../service/product-modal.service';

@Component({
  selector: 'product-accordion-panel',
  templateUrl: './product-accordion-panel.component.html',
  styleUrls: ['./product-accordion-panel.component.scss']
})
export class ProductAccordionPanelComponent extends ProductBase implements OnInit {
  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: {};
  @Input() progressBar: { [key: string]: { completed: number, compliant: number } };

  public expandedTabs: {} = {
    productDetails: false,
    erq: false,
    fis: false,
    companyDetails: false,
    companyDiversity: false,
    insurance: false,
  };

  ngOnInit(): void {
  }

  openDetailedInformation() {
    console.log('empty');
  }

  setExpandedClass(val: string) {
    if (this.expandedTabs[val] && this.modalExpanded) {
      return 'product-view-expanded';
    }
    return 'product-view-not-expanded';
  }
}
