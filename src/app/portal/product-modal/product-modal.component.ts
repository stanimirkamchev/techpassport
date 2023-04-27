import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { ProductModalService } from './service/product-modal.service';
import { Observable } from 'rxjs';
import { IErqDto } from '../enterprise-ready-questions/models/erq-dto';
import { IApplicationSecurity, IBreachNotification, ICertification, IDeletionRetention, IEncryption, IPrivacy, IRecovery, ISsdlc, IStorageSeparation } from '../enterprise-ready-questions/models';
import * as ERQModel from '../enterprise-ready-questions/models';
import { ErqType, IErq } from '../enterprise-ready-questions/models/erq';
import { ERQProgressService } from '../enterprise-ready-questions/service/erq-proggress.service';

@Component({
  selector: 'product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ProductModalComponent>,
    private productModalService: ProductModalService,
    private progressService: ERQProgressService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productModalService.setNewExpansionValue(false);
    if (data) {
      this.apiService.getAdditionalProductDetails(data.productId).subscribe(
        (res: HttpResponse<any>) => {
          const result = res.body;
          if (result) {
            this.productId = result.id;
            this.product = result.product;
            this.productSupplier = result.supplier;
            this.productDetails = result.details.details;
            this.productCollateral = result.productCollateral;
            this.productSupplier = result.supplier;
            this.projectDetail = result.projectDetail;
            this.erq = result.erq;
            this.payload = result;
            if (this.erq) {
              const certification: ICertification = new ERQModel.Certification(this.erq.certification).data;
              const breachNotification: IBreachNotification = new ERQModel.BreachNotification(this.erq.breachNotification).data;
              const ssdlc: ISsdlc = new ERQModel.Ssdlc(this.erq.ssdlc).data;
              const applicationSecurity: IApplicationSecurity = new ERQModel.ApplicationSecurity(this.erq.applicationSecurity).data;
              const deletionRetention: IDeletionRetention = new ERQModel.DeletionRetention(this.erq.deletionRetention).data;
              const privacy: IPrivacy = new ERQModel.Privacy(this.erq.privacy).data;
              const storageSeparation: IStorageSeparation = new ERQModel.StorageSeparation(this.erq.storageSeparation).data;
              const recovery: IRecovery = new ERQModel.Recovery(this.erq.recovery).data;
              const encryption: IEncryption = new ERQModel.Encryption(this.erq.encryption).data;
              const erqData = {
                certification,
                breachNotification,
                ssdlc,
                applicationSecurity,
                deletionRetention,
                privacy,
                storageSeparation,
                recovery,
                encryption
              } as unknown as IErq;
              this.progressBar = this.progressService.calculateAlgorithm(erqData);
            }
            setTimeout(() => {
              this.loaded = true;
            }, 200);
          }
        },
        (respError: Error) => {
          try {
            return (respError as any).error.message;
          } catch (error) {
            return respError.message;
          }
        }
      );
    }
  }

  public payload: any = {};
  public productId: string;
  public product: string;
  public productSupplier: {};
  public productDetails = {};
  public projectDetail = null;
  public productCollateral = [];
  public isExpanded = false;
  public isExpanded$: Observable<boolean>;
  public loaded = false;
  public erq = {} as IErqDto;
  progressBar: { [key: string]: { completed: number, compliant: number } } = {
    [ErqType.Certification]: { completed: null, compliant: null },
    [ErqType.BreachNotification]: { completed: null, compliant: null },
    [ErqType.Ssdlc]: { completed: null, compliant: null },
    [ErqType.ApplicationSecurity]: { completed: null, compliant: null },
    [ErqType.DeletionRetention]: { completed: null, compliant: null },
    [ErqType.Privacy]: { completed: null, compliant: null },
    [ErqType.StorageSeparation]: { completed: null, compliant: null },
    [ErqType.Recovery]: { completed: null, compliant: null },
    [ErqType.Encryption]: { completed: null, compliant: null },
    total: {
      completed: 0,
      compliant: 0
    }
  };

  ngOnInit(): void {
    this.isExpanded$ = this.productModalService.modalExpanded$;
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
    this.productModalService.setNewExpansionValue(this.isExpanded);
    if (this.isExpanded) {
      document.querySelector('.product-modal').classList.add('expanded');
      document.querySelector('.tiles').classList.add('tiles--expanded');
    } else {
      document.querySelector('.product-modal').classList.remove('expanded');
      document.querySelector('.tiles').classList.remove('tiles--expanded');
    }
  }

  public exit() {
    this.dialogRef.close();
  }
}
