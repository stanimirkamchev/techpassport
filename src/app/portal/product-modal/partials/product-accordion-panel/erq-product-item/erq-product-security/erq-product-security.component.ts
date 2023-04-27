import { Component, Input, OnInit } from '@angular/core';
import { IApplicationSecurityDTO, IErqDto } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-security',
  templateUrl: './erq-product-security.component.html',
  styleUrls: ['./erq-product-security.component.scss']
})
export class ErqProductSecurityComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: IApplicationSecurityDTO;

  ngOnInit(): void {
    if (!this.payload || !this.payload.applicationSecurity) {
      this.data = {
        saml_oidc_sso: null,
        password_source_ip_validation: null,
        password_source_ip_validation_api: null,
        authOther: null,
        authNone: null,
        authOtherName: null,
        aes_128_192_256: null,
        sha_256_384_512: null,
        argon_pbkdf2: null,
        encriptOther: null,
        encriptNone: null,
        encriptOtherName: null,
      };
    } else {
      this.data = this.payload.applicationSecurity;
    }
  }

}
