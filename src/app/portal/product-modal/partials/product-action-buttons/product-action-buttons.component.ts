import { Component, Input, OnInit } from '@angular/core';
import { ConnectMeService } from '@services/connectme/connectme.service';
import { ApiService } from '@services/api/api.service';
import { InformationRequestedComponent } from 'src/app/marketplace/information-requested/information-requested.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'product-action-buttons',
  templateUrl: './product-action-buttons.component.html',
  styleUrls: ['./product-action-buttons.component.scss']
})
export class ProductActionButtonsComponent implements OnInit {
  constructor(
    private addDialog: MatDialog,
    public connectMeService: ConnectMeService,
    public apiService: ApiService
  ) { }

  @Input() supplier: any;
  @Input() product: any;
  @Input() payload: any;
  @Input() compliant: any;

  ngOnInit(): void {

  }

  // hasDetailsAccess(product: any) {
  //   return product.reviewConnectionStatus === 'completed' || product.offConnectionStatus === 'completed';
  // }
  // isRapidNDA(product: any) {
  //   return product.rapidNDA === true;
  // }
  // isRapidPOC(product: any) {
  //   return product.rapidPOC === true;
  // }

  private populateConnectMe(action: string): ConnectMeModalData {
    let pocConnectionStatus = '';
    let reviewConnectionStatus = '';
    let offConnectionStatus = '';

    if (this.payload.handshake && this.payload.handshake.reason === 'POC') {
      pocConnectionStatus = this.payload.handshake.status;
    }

    if (this.payload.handshake && this.payload.handshake.reason === 'review') {
      reviewConnectionStatus = this.payload.handshake.status;
    }

    if (this.payload.handshake && this.payload.handshake.reason === 'nda') {
      offConnectionStatus = this.payload.handshake.status;
    }

    const productObj: ProductObj = {
      id: this.payload.product._id,
      handshakeID: this.payload.handshake ? this.payload.handshake._id : null,
      projectName: this.payload.handshake ? this.payload.handshake.project.name : null,
      productData: null,
      step: this.payload.poc ? this.payload.poc.step : null
    };

    const data: ConnectMeModalData = {
      action,
      supplierID: this.payload.product.supplierEntity,
      supplier: this.payload.supplier.name,

      productID: this.payload.product._id,
      product: this.payload.product.name,

      productObj,
      rapidNDA: this.payload.supplier.rapidNDA,
      rapidPOC: this.payload.product.rapidPOC,

      pocConnectionStatus,
      reviewConnectionStatus,
      offConnectionStatus,
      nda: this.payload.handshake ? this.payload.handshake.nda : null
    };

    return data;
  }

  doAction(action: string) {
    const data = this.populateConnectMe(action);
    return this.connectMeService.doAction(data, action);
  }

  openInformationRequestDialog() {
    const ref = this.addDialog.open(InformationRequestedComponent, {
      width: '720px',
      minHeight: '450px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: [{
        supplierID: this.payload.product.supplierEntity,
        productID: this.payload.product._id
      }]
    });
    ref.afterClosed().subscribe(result => {
      // this.clearTable = true;
    });
  }

  checkPermissionsForButton(type: string) {
    const product = this.populateConnectMe(type);

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
          this.compliant < 100 &&
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
