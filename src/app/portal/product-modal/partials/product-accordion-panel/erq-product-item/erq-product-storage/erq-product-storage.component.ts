import { Component, Input, OnInit } from '@angular/core';
import { IErqDto, IStorageSeparationDTO } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-storage',
  templateUrl: './erq-product-storage.component.html',
  styleUrls: ['./erq-product-storage.component.scss']
})
export class ErqProductStorageComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: IStorageSeparationDTO;

  ngOnInit(): void {
    if (this.payload && this.payload.storageSeparation) {
      this.data = this.payload.storageSeparation;
    } else {
      this.data = {
        serviceCountry_uk: null,
        serviceCountry_usa: null,
        serviceCountry_canada: null,
        serviceCountry_eu: null,
        serviceCountry_other: null,
        serviceCountry_other_text: null,

        maintenanceCountry_uk: null,
        maintenanceCountry_usa: null,
        maintenanceCountry_canada: null,
        maintenanceCountry_eu: null,
        maintenanceCountry_other: null,
        maintenanceCountry_other_text: null,

        utilize: null,
        logicalMoreInfo: null,

        dataSetAccess: null,
        setAccessMoreInfo: null,

        changeManagement: null,
        changeManagementMoreInfo: null,

        guaranteeLocation: null,
        moreInfo: null,
      };
    }
  }
}
