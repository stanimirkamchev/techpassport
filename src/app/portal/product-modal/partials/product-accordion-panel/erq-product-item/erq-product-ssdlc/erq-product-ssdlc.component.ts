import { Component, Input, OnInit } from '@angular/core';
import { IErqDto, ISsdlcDTO } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-ssdlc',
  templateUrl: './erq-product-ssdlc.component.html',
  styleUrls: ['./erq-product-ssdlc.component.scss']
})
export class ErqProductSsdlcComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: ISsdlcDTO;

  ngOnInit(): void {
    if (this.payload && this.payload.ssdlc) {
      this.data = this.payload.ssdlc;
    } else {
      this.data = {
        penetrationTestCovering: null
      };
    }
  }

}
