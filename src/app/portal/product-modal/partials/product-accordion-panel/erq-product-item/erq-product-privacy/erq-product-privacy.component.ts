import { Component, Input, OnInit } from '@angular/core';
import { IErqDto, IPrivacyDTO } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-privacy',
  templateUrl: './erq-product-privacy.component.html',
  styleUrls: ['./erq-product-privacy.component.scss']
})
export class ErqProductPrivacyComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: IPrivacyDTO;

  ngOnInit(): void {
    if (this.payload && this.payload.privacy) {
      this.data = this.payload.privacy;
    } else {
      this.data = {
        country_uk: null,
        country_usa: null,
        country_canada: null,
        country_eu: null,
        country_none: null,

        legislation_uk: null,
        legislation_usa: null,
        legislation_canada: null,
        legislation_eu: null,

        gdpr: null,
        ccpa: null,
        pipeda: null,
        other: null,
        otherText: null,

        data_consumed_uk: null,
        data_consumed_usa: null,
        data_consumed_canada: null,
        data_consumed_eu: null,
        data_consumed_no: null,

        yes: null,
        no: null,
        na: null,
      };
    }
  }
}
