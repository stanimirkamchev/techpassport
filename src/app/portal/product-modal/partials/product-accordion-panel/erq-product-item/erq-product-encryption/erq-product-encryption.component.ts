import { Component, Input, OnInit } from '@angular/core';
import { IEncryptionDTO, IErqDto } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-encryption',
  templateUrl: './erq-product-encryption.component.html',
  styleUrls: ['./erq-product-encryption.component.scss']
})
export class ErqProductEncryptionComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: IEncryptionDTO;

  ngOnInit(): void {
    if (this.payload && this.payload.encryption) {
      this.data = this.payload?.encryption;
    } else {
      this.data = {
        yes: null,
        no: null,
        na: null,

        digitalSignature: null,
        encryptionMethod: null,
        allEncryptionKeysUsed: null,
        allEncryptionKeysMoreInfo: null,
        encryptionKeyRotation: null,
        allEncryptionKeysUsedInConjunction: null,
      };
    }
  }
}
