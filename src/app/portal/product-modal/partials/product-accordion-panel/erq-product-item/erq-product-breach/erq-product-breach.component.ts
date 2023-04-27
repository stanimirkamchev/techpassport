import { Component, Input, OnInit } from '@angular/core';
import { IBreachNotificationDTO, IErqDto } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-breach',
  templateUrl: './erq-product-breach.component.html',
  styleUrls: ['./erq-product-breach.component.scss']
})
export class ErqProductBreachComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: IBreachNotificationDTO;

  ngOnInit(): void {
    if (this.payload && this.payload.breachNotification) {
      this.data = this.payload.breachNotification;
    } else {
      this.data = {
        breachNotification: null
      };
    }
  }
}
