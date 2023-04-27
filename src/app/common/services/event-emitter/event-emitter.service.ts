/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  constructor() { }
}*/

import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  public onRegisterEvent: EventEmitter<any> = new EventEmitter();
  public onPocEvent: EventEmitter<any> = new EventEmitter();
  public onSupplierOnboardEvent: EventEmitter<any> = new EventEmitter();
  public onProductOnboardEvent: EventEmitter<any> = new EventEmitter();
  public onOnboardDoneEvent: EventEmitter<any> = new EventEmitter();
  public onOnDocuSignEvent: EventEmitter<any> = new EventEmitter();
  public onSessionCheckedEvent: EventEmitter<any> = new EventEmitter();
  public onAssesmentEvent: EventEmitter<any> = new EventEmitter();
  public onContactEvent: EventEmitter<any> = new EventEmitter();
  public onLoginEvent: EventEmitter<any> = new EventEmitter();
  public onLoggedinEvent: EventEmitter<any> = new EventEmitter();
  public onCheckSessionEvent: EventEmitter<any> = new EventEmitter();
  public onConnectMeEvent: EventEmitter<any> = new EventEmitter();
  public onEditPOCEvent: EventEmitter<any> = new EventEmitter();
  public onUpdatePOCListEvent: EventEmitter<any> = new EventEmitter();
  public onConnectMeResposneBackEvent: EventEmitter<any> = new EventEmitter();
  public onChangePageEvent: EventEmitter<any> = new EventEmitter();
  public onOpenJustificationEvent: EventEmitter<any> = new EventEmitter();




  public subsVar: Subscription;
  public onboardStatus: string = "none";
  public hasProduct: boolean = false;

  //public  sessionStatus          : boolean = null;
  //public  sessionDetails         : string = "";

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }


  onLogin(): void {
    this.onLoginEvent.emit();
  }
  onLoggedin(): void {
    this.onLoggedinEvent.emit();
    this.onCheckSessionEvent.emit(true);
  }
  onRegister(type: string): void {
    this.onRegisterEvent.emit(type);
  }
  onPoc(): void {
    this.onPocEvent.emit();
  }
  onSupplierOnboad(step?: number): void {
    this.onSupplierOnboardEvent.emit(step);
  }
  onProductOnboad(product = {}, supplierId?: string): void {
    this.onProductOnboardEvent.emit({ ...product, supplierId });
  }
  onAssesment(product?, category?: number, readOnly?: boolean): void {
    if (!product)
      product = {};
    product.jumpToCategory = category;
    product.readOnly = readOnly;
    this.onAssesmentEvent.emit(product);
  }
  onConnectMe(data: any): void {
    this.onConnectMeEvent.emit(data);
  }
  onContact(category?: string): void {
    this.onContactEvent.emit(category);
  }
  onOnDocuSign(url: string, handshakeID?: string, clickToSign?: boolean, clickToSignData?: any): void {
    this.onOnDocuSignEvent.emit({ url, handshakeID, clickToSign, clickToSignData });
  }
  onOnboadDone(status: string, hasProduct: boolean, firstRun: boolean): void {
    this.onboardStatus = status;
    this.hasProduct = hasProduct;
    this.onOnboardDoneEvent.emit();
    /*if (firstRun === true && (status === "done" || status === "inprogress")){
       this.router.navigateByUrl('/portal');
    }*/
  }
  onSessionChecked(status: boolean): void {
    this.onSessionCheckedEvent.emit();
    if (status === false && this.router.url.indexOf('/join') !== 0) {
      this.router.navigateByUrl('/home');
      //this.dialog.closeAll();
    }
  }
  onEditPOC(project): void {
    this.onEditPOCEvent.emit(project);
  }
  onUpdatePOCList(): void {
    this.onUpdatePOCListEvent.emit();
  }


  onConnectMeResposneBack(handshakeID: string, approved: boolean): void {
    this.onConnectMeResposneBackEvent.emit({ handshakeID, approved })
  }

  onChangePage(page: string): void {
    this.onChangePageEvent.emit(page);
  }
  onOpenJustification(title: string, message: string): void {
    this.dialog.open(AlertModalComponent, {
      width: '510px',
      height: '260px',
      disableClose: true,
      data: { title: title, message: `Rejection justification: ${message}`, links: null, actions: [{ label: "Close", color: "primary" }] }
    });
  }





}
