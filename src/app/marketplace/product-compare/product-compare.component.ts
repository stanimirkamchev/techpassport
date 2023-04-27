import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { ConnectMeService } from '@services/connectme/connectme.service';
import { FilterService } from '@shared/filter-service';
import { IApplicationSecurity, IBreachNotification, ICertification, IDeletionRetention, IEncryption, IPrivacy, IRecovery, ISsdlc, IStorageSeparation } from 'src/app/portal/enterprise-ready-questions/models';
import { IErq } from 'src/app/portal/enterprise-ready-questions/models/erq';
import { ProductModalComponent } from 'src/app/portal/product-modal/product-modal.component';
import { InformationRequestedComponent } from '../information-requested/information-requested.component';
import * as ERQModel from 'src/app/portal/enterprise-ready-questions/models';
import { ERQProgressService } from 'src/app/portal/enterprise-ready-questions/service/erq-proggress.service';

export interface ProductObj {
  id: string; // poc.productID,
  handshakeID: string; // poc.handshakeID,
  projectName: string; // poc.name,
  productData: null; // null,
  step: any; // poc.pocStep
}

export interface ConnectMeModalData {
  action: string;
  supplier: string;
  product: string;

  supplierID: string;
  productID: string;

  productObj: ProductObj;

  rapidNDA: boolean;
  rapidPOC: boolean;

  pocConnectionStatus: any;
  reviewConnectionStatus: any;
  nda: any;

  offConnectionStatus: any;
}

@Component({
  selector: 'product-compare',
  templateUrl: './product-compare.component.html',
  styleUrls: ['./product-compare.component.scss']
})
export class ProductCompareComponent implements OnInit {

  rows = [
    // {
    //   value: 'ratings',
    //   label: 'Ratings'
    // },
    {
      value: 'trialFee',
      label: 'Trial fee',
      info: 'content'
    },
    {
      value: 'PIData',
      label: 'PI data',
      info: 'content'
    },
    {
      value: 'location',
      label: 'Location'
    },
    {
      value: 'companyAge',
      label: 'Company age'
    },
    {
      value: 'fundingRound',
      label: 'Funding round'
    },
    {
      value: 'boardDiversity',
      label: 'Board diversity'
    },
    {
      value: 'founderDiversity',
      label: 'Founder diversity'
    },
    {
      value: 'hostingProviders',
      label: 'Hosting Providers'
    },
    {
      value: 'actions',
      label: ''
    }
  ];
  products: any[] = [{}, {}, {}];
  selectedCount = 0;

  constructor(
    public dialogRef: MatDialogRef<ProductCompareComponent>,
    public connectMeService: ConnectMeService,
    private addDialog: MatDialog,
    private apiService: ApiService,
    private progressService: ERQProgressService,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private filterService: FilterService,
  ) {
  }

  getLogo(supplierId: string) {
    return `/api/v1/admin/supplier/${supplierId}/companylogo`;
  }

  ngOnInit(): void {
    this.filterService.selectedDataOverview.subscribe((res) => {
      this.products = res.selected.slice(0, 3);
      this.selectedCount = res.selected.length;
    });
  }

  openProductDetailsModal(product: any) {
    console.log('Product', product);
    const ref = this.addDialog.open(ProductModalComponent, {
      width: '580px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'product-modal',
      disableClose: false,
      data: { productId: product._id }
    });
    ref.afterClosed().subscribe(result => {
      // after close
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  removeProduct(product: any) {
    this.filterService.unselectData(product);
  }

  getHostingProvider(providerName: string) {
    switch (providerName) {
      case 'AWS':
        return '../../../assets/img/marketplace/AWS.png';
      case 'Google':
        return '../../../assets/img/marketplace/Google.png';
      case 'IBM':
        return '../../../assets/img/marketplace/Google.png';
      case 'Azure':
        return '../../../assets/img/marketplace/Azure.png';
      default:
        return '';
    }
  }

  // ERQs

  calculateERQS(product: any) {
    const w = this.data.find(d => d.product._id === product._id);
    if (w && w.erq) {
      const certification: ICertification = new ERQModel.Certification(w.erq.certification).data;
      const breachNotification: IBreachNotification = new ERQModel.BreachNotification(w.erq.breachNotification).data;
      const ssdlc: ISsdlc = new ERQModel.Ssdlc(w.erq.ssdlc).data;
      const applicationSecurity: IApplicationSecurity = new ERQModel.ApplicationSecurity(w.erq.applicationSecurity).data;
      const deletionRetention: IDeletionRetention = new ERQModel.DeletionRetention(w.erq.deletionRetention).data;
      const privacy: IPrivacy = new ERQModel.Privacy(w.erq.privacy).data;
      const storageSeparation: IStorageSeparation = new ERQModel.StorageSeparation(w.erq.storageSeparation).data;
      const recovery: IRecovery = new ERQModel.Recovery(w.erq.recovery).data;
      const encryption: IEncryption = new ERQModel.Encryption(w.erq.encryption).data;
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
      const erqVal = this.progressService.calculateAlgorithm(erqData);
      return erqVal.total.compliant.toFixed(0);
    }
    return 0;
  }

  // REQUEST BUTTONS
  private populateConnectMe(product: any, action: string): ConnectMeModalData {
    const obj = this.data.find(el => el.product._id === product._id);
    if (!obj) {
      return null;
    }

    let pocConnectionStatus = '';
    let reviewConnectionStatus = '';
    let offConnectionStatus = '';

    if (obj.handshake && obj.handshake.reason === 'POC') {
      pocConnectionStatus = obj.handshake.status;
    }

    if (obj.handshake && obj.handshake.reason === 'review') {
      reviewConnectionStatus = obj.handshake.status;
    }

    if (obj.handshake && obj.handshake.reason === 'nda') {
      offConnectionStatus = obj.handshake.status;
    }

    const productObj: ProductObj = {
      id: obj.product._id,
      handshakeID: obj.handshake ? obj.handshake._id : null,
      projectName: obj.handshake ? obj.handshake.project.name : null,
      productData: null,
      step: obj.poc ? obj.poc.step : null
    };

    const data: ConnectMeModalData = {
      action,
      supplierID: obj.product.supplierEntity,
      supplier: obj.supplier.name,

      productID: obj.product._id,
      product: obj.product.name,

      productObj,
      rapidNDA: obj.supplier.rapidNDA,
      rapidPOC: obj.product.rapidPOC,

      pocConnectionStatus,
      reviewConnectionStatus,
      offConnectionStatus,
      nda: obj.handshake ? obj.handshake.nda : null
    };

    return data;
  }

  doAction(product: any, action: string) {
    const data = this.populateConnectMe(product, action);
    return this.connectMeService.doAction(data, action);
  }

  openInformationRequestDialog(product: any) {
    const ref = this.addDialog.open(InformationRequestedComponent, {
      width: '720px',
      minHeight: '450px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: [{
        supplierID: product.supplier._id,
        productID: product._id
      }]
    });
    ref.afterClosed().subscribe(result => {
      // this.clearTable = true;
    });
  }

  checkPermissionsForButton(obj: any, type: string) {
    const product = this.populateConnectMe(obj, type);

    try {
      if (
        !this.apiService.sessionObject ||
        !this.apiService.sessionObject.permissions ||
        !(this.apiService.sessionObject.permissions as any).details
      ) {
        return false;
      }
      if (type === 'info') {
        return (
          product.offConnectionStatus !== 'completed' &&
          product.reviewConnectionStatus !== 'completed' &&
          (this.apiService.sessionObject.permissions as any).details.indexOf('R') > -1
        );
      }
      if (type === 'details') {
        return (
          (product.offConnectionStatus === 'completed' ||
            (product.reviewConnectionStatus === 'completed' && product.rapidNDA === true)) &&
          (this.apiService.sessionObject.permissions as any).details.indexOf('R') > -1
        );
      }
      if (type === 'poc') {
        return product.nda || (product.rapidPOC && this.apiService.sessionObject.rapid);
      }// product.rapidPOC;// || product.offConnectionStatus === 'completed';


      if (type === 'nda') {
        return !product.nda && this.apiService.sessionObject.requireNDA;
      }// !product.rapidNDA && !product.offConnectionStatus;/// <<< AD THIS

      if (type === 'compliance') {
        return this.apiService.sessionObject.rapid && product.rapidPOC && !this.apiService.sessionObject.requireNDA;
      }// product.nda;//product.rapidNDA && (!product.reviewConnectionStatus || product.reviewConnectionStatus === '')


      if (type === 'ndaInfo') {
        return (product.reviewConnectionStatus
          && (product.reviewConnectionStatus !== 'completed' && product.reviewConnectionStatus !== 'declined'))
          || (product.offConnectionStatus && product.offConnectionStatus !== 'completed');
      }
    } catch (error) {
      // console.log(error);
    }
    return false;
  }
}
