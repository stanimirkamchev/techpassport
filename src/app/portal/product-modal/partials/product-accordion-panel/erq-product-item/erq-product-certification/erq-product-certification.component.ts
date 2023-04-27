import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { ICertificationDTO, IErqDto } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-certification',
  templateUrl: './erq-product-certification.component.html',
  styleUrls: ['./erq-product-certification.component.scss']
})
export class ErqProductCertificationComponent extends ProductBase implements OnInit {

  constructor(
    public productModalService: ProductModalService,
    private apiService: ApiService
  ) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: ICertificationDTO;

  ngOnInit(): void {
    if (this.payload && this.payload.certification) {
      this.data = this.payload.certification;
    } else {
      this.data = {
        soc2: null,
        iso27001: null,
        other: null,
        none: null,

        socUpToDate: null,
        socFileInfo: null,
        socRenewalDate: null,
        socPlansToObtain: null,
        socExpectedDate: null,

        isoUpToDate: null,
        isoFileInfo: null,
        isoRenewalDate: null,
        plansToObtain: null,
        expectedDate: null,

        name: null,
        otherUpToDate: null,
        otherFileInfo: null,
        otherRenewalDate: null,
        otherPlansToObtain: null,
        otherExpectedDate: null,
      };
    }
  }

  download(doc: any) {
    const key = doc.file;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.apiService.getFileUrl(key);
    a.download = key;
    a.click();
  }
}
