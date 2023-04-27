import { Component, Input, OnInit } from '@angular/core';
import { IErqDto, IRecoveryDTO } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from '../../../../product-base.component';
import { ProductModalService } from '../../../../service/product-modal.service';

@Component({
  selector: 'erq-product-recovery',
  templateUrl: './erq-product-recovery.component.html',
  styleUrls: ['./erq-product-recovery.component.scss']
})
export class ErqProductRecoveryComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) { super(productModalService); }

  @Input() payload: IErqDto | null;

  data: IRecoveryDTO;

  ngOnInit(): void {
    if (this.payload && this.payload.recovery) {
      this.data = this.payload.recovery;
    } else {
      this.data = {
        criticality: null,
        recoveryTime: null
      };
    }
  }

}
