import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ApiService } from '@services/api/api.service';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { ProductElement } from '../product/product.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PocModalComponent } from '../../../portal/poc-modal/poc-modal.component';


@Injectable({
  providedIn: 'root'
})
export class ConnectMeService {

  public hasNDA: any = {
    //'5e8d4bfbe1acfd09ee9f0aab' : true
  }
  constructor(
    private apiService: ApiService,
    private socket: Socket,
    private connectMeDialog: MatDialog,
    private pocDialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {

  }
  buildProductElement(data: any): ProductElement {
    return {
      id: data.id,
      position: 1,
      name: data.product.name,
      assessments: data.assessments,
      status: '',
      statusHistory: data.status,
      actions: '',
      class: '',
      supplier: data.supplier,
      basic: data.product,
      details: data.details,
      tags: data.tags,
      insurance: data.insurance
      //jumpToCategory?: number;
    }
  }
  doAction(product: any, action: string, navigateToTab?: number, callback?: Function) {
    console.log("doAction", product, action)
    if (action === 'compliance') {
      this.openConnectMeDialog(product, 'compliance');
    } else if (action === 'nda') {
      this.openConnectMeDialog(product, 'nda');
    } else if (action === 'POC') {// && (product.rapidNDA === true || product.rapidPOC === true || product.offConnectionStatus === 'completed')) {
      this.openConnectMeDialog(product, 'poc');
    } else if (action !== 'POC' && product.nda) {//&& (product.reviewConnectionStatus === 'completed' || product.offConnectionStatus === 'completed')
      this.openDetails(product, navigateToTab);
    }/*se if (action === 'Start POC' && (product.rapidNDA === true || product.rapidPOC === true || product.offConnectionStatus === 'completed')) {
      this.startPOC(product);
    }*/




    //this.startPOC(product);

  }

  startPOC(poc: any) {
    this.pocDialog.open(PocModalComponent, {
      width: '85vw',
      height: '85vh',
      maxWidth: undefined,
      disableClose: true,
      data: {
        id: poc.productID,
        handshakeID: poc.handshakeID,
        projectName: poc.name,
        productData: null,
        step: poc.pocStep
      }
    });
  };

  openDetails(product: any, navigateToTab: number) {
    this.apiService.companyPOCProductDetails(product.productID)
      .subscribe(
        (data: HttpResponse<Object>) => {
          let product = this.buildProductElement(data.body);
          this.eventEmitterService.onAssesment(product, navigateToTab, true);/// GET
        },
        (respError: Error) => {
          //product.loading = false;
          console.log('respError', respError);
        }
      )
  }
  openConnectMeDialog(product: any, action: string) {
    let data = {
      action: action,
      supplierID: product.supplierID,
      supplier: product.name,

      productID: product.productID,
      product: product.productName,

      productObj: product,

      rapidNDA: product.rapidNDA,
      rapidPOC: product.rapidPOC,

      pocConnectionStatus: product.pocConnectionStatus,
      reviewConnectionStatus: product.reviewConnectionStatus,
      nda: product.nda


    }
    this.eventEmitterService.onConnectMe(data);/// GET
  }

  async connectMe(projectID: string, productID: string, reason: string, callback, errorCallback) {
    this.apiService.connectMe
      (projectID, productID, reason)
      .subscribe(callback, errorCallback)
  }

  async connectMeRespond(connectMeId: string, accept: boolean, message: string, callback, errorCallback) {
    this.apiService.connectMeRespond(connectMeId, accept, message)
      .subscribe(callback, errorCallback)
  }

  signNDA(handshakeID: string, callback?: Function) {
    this.eventEmitterService.onOnDocuSign(null, handshakeID, false);
    callback(null);
  }
}
