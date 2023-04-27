import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBase } from '../../../product-base.component';
import { ProductModalService } from '../../../service/product-modal.service';

@Component({
  selector: 'insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent extends ProductBase implements OnInit {

  @Input() payload: any;
  isExpanded$: Observable<boolean>;

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  ngOnInit(): void {
    this.isExpanded$ = this.productModalService.modalExpanded$;
  }

  getCurrency(val: string) {
    return val === 'usd' ? '$' : '£';
  }

}
