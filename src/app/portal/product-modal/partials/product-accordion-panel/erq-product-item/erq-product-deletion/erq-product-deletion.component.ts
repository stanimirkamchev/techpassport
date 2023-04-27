import { Component, Input, OnInit } from '@angular/core';
import { IDeletionRetentionDTO, IErqDto } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ProductBase } from 'src/app/portal/product-modal/product-base.component';
import { ProductModalService } from 'src/app/portal/product-modal/service/product-modal.service';

@Component({
  selector: 'erq-product-deletion',
  templateUrl: './erq-product-deletion.component.html',
  styleUrls: ['./erq-product-deletion.component.scss']
})
export class ErqProductDeletionComponent extends ProductBase implements OnInit {

  constructor(public productModalService: ProductModalService) {
    super(productModalService);
  }

  @Input() payload: IErqDto | null;

  data: IDeletionRetentionDTO;

  ngOnInit(): void {

    if (this.payload && this.payload.deletionRetention) {
      this.data = this.payload?.deletionRetention;
    } else {
      this.data = {
        yes: null,
        no: null,
        deleteAbility: null,
        provideACopy: null,
        currentProcessExplanationOfDeletingCustomersData: null,
        currentProcessExplanationOfCopyingCustomersData: null
      };
    }
  }
}
