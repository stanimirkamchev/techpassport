import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { AssessmentComponent } from 'src/app/portal/assessment-modal/assessment.component';
import { OnboardingStepAbstract } from '../../onboarding.abstract';
import { Buyer, BuyerContractTemplate } from '../../store/buyer/buyer.model';
import { State } from '../../store';
import { Store } from '@ngrx/store';
import * as buyer from '../../store/buyer/buyer.selectors';

import { Socket } from 'ngx-socket-io';
import { F, R } from '@angular/cdk/keycodes';
@Component({
  selector: 'buyer-settings-step',
  templateUrl: './buyer-settings-step.component.html',
  styleUrls: ['./buyer-settings-step.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerSettingsStepComponent),
    multi: true
  }]
})


export class BuyerSettingsStepComponent extends OnboardingStepAbstract<Buyer>  {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  public selectedInput: BuyerContractTemplate;
  public files: BuyerContractTemplate[] = [
    { label: 'Free PoC Contract', contractType: 'freePoC', uploadingFile: false },
    { label: 'Paid PoC Contract', contractType: 'paidPoC', uploadingFile: false },
    { label: 'Non Disclosure Agreement', contractType: 'nda', uploadingFile: false }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buyer?: Buyer, step: number },
    private socket: Socket,
    public changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AssessmentComponent>,
    public apiService: ApiService,
    private alertDialog: MatDialog,
    private store: Store
  ) {

    super();

    this.store.select(buyer.selectBuyerState).subscribe(resData => {
      (this.data as any).buyer = resData;
      if ((this.data.buyer as any).value._id) {
        const apiCall = this.apiService.adminGetContractTempletes((this.data.buyer as any).value._id);
        apiCall.subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          (data: BuyerContractTemplate[]) => {
            for (const d of data) {
              const f=  this.files.find(x => x.contractType === d.contractType);
              f._id = d._id;
              f.hash = d.hash;
              f.status = d.status;
            }
            this.changeDetectorRef.detectChanges();
          },
          (respError: Error) => {
            console.log('respError', respError);
          });
      }
    });

    this.socket.on('file-status', (event) => {
      if (!event.hash) { return; }
      for (const f of this.files) {
        if (event.hash === f.hash) {
          f.status = event.status;
          f.errorMessage = event.message;
          this.changeDetectorRef.detectChanges();
          return;
        }
      }
    });
  }

  downloadFile(contract) {
    const url = this.apiService.getContractTemplateURL(contract._id);
    if (url === null) { return; }
    const elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
    window.focus();
  }
  removeFile(contract) {
    this.apiService.removeContractTemplate(contract._id).subscribe(
      (data: HttpResponse<any>) => {
        if ((data.body as any).status === 'success') {
          contract._id = null;
          contract.status = null;
          contract.hash = null;
          this.changeDetectorRef.detectChanges();
        }
      },
      (respError: Error) => {
        console.log('respError', respError);
      }
    );
  }
  openInfoSecFileInput(contract) {
    this.selectedInput = contract;
    this.fileInput.nativeElement.click();
    this.fileInput.nativeElement.value = null;
  }
  async onFileInputChange(event) {

    if (event.target.files && event.target.files[0]) {
      const ref = this.alertDialog.open(AlertModalComponent, {
        width: '360px',
        height: '180px',
        disableClose: true,
        data: {
          title: 'Upload in progress!',
          message: 'Please do not close this window until upload completes!',
          actions: [{ label: 'Close', color: 'primary' }],
          links: [],
          progress: true,
        },
      });
      this.selectedInput.uploadingFile = true;
      this.selectedInput.errorMessage = null;
      const buyerId = (this.data.buyer as any).value._id;
      const contractType = this.selectedInput.contractType;
      const file = event.target.files[0];
      // this.store.dispatch(uploadContractTemplateBuyer({ buyerId, contractType, file }));
      const apiCall = this.apiService.adminUploadContractTemplete(
        buyerId,
        contractType,
        file,
      );
      apiCall.subscribe(
        (data: HttpResponse<any>) => {

          this.selectedInput.uploadingFile = false;
          this.selectedInput.status = (data.body as any).status;
          this.selectedInput.hash = (data.body as any).hash;
          this.selectedInput._id = (data.body as any)._id;
          this.selectedInput.fileCheck = (data.body as any).fileCheck;

          this.changeDetectorRef.detectChanges();
          ref.close();
        },
        (respError: Error) => {
          this.selectedInput.uploadingFile = false;
          this.selectedInput.errorMessage = (respError as any).error.message;
          this.selectedInput.status = 'error';
          this.changeDetectorRef.detectChanges();
          ref.close();
        }
      );
      //

    }
  }
}
