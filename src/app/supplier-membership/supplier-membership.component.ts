import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { DocuSignComponent } from '@shared/modals/docu-sign-modal/docu-sign.component';
import { Socket } from 'ngx-socket-io';

interface Membership {
  name: string,
  id?: string,
  planId?: string,
  plans: Array<any>,
  subscribtion: string,
  intent: any,
  payment: boolean
}

@Component({
  selector: 'supplier-membership',
  templateUrl: './supplier-membership.component.html',
  styleUrls: ['./supplier-membership.component.scss']
})

export class SupplierMembershipComponent implements OnInit {

  public membership: Membership = {
    name: "none",
    id: null,
    planId: null,
    plans: [],
    subscribtion: null,
    intent: {},
    payment: false
  };
  public terms = {
    signRequested: false,
    signResponded: false,
    status: "none",
    signDate: null,
    stepReady: false,
    membershipID: null,
    agreed: {
      /*coupon: false,
      perMonth: false,
      perYear: false*/
    }
  };

  public requestInProgress: boolean = false;
  public paymentFormGroup: FormGroup;
  public membershipTryOption: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private docuSignDialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private socket: Socket) {
    this.paymentFormGroup = fb.group({
      how: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans() {
    this.apiService.getMembershipPlans().subscribe(
      (data: HttpResponse<Object>) => {
        this.membership.plans = (data as any).body as Array<any>;
        this.membership.plans[2] = this.membership.plans[0]; // COPY PLANS
        this.membership.plans[3] = this.membership.plans[1]; // COPY PLANS
      },
      (respError: Error) => { }
    );
  }

  public isValid(): boolean {
    let mtype = this.membershipTryOption;
    let period = this.paymentFormGroup.value.how;
    return (this.requestInProgress === false && this.membership.planId && this.terms.agreed[mtype + period]);
  }
  public getAgreement(): any {
    let mtype = this.membershipTryOption;
    let period = this.paymentFormGroup.value.how;
    return this.membership.intent[mtype + period];
  }

  public currectMembersip(membership: any): void {

    this.membership.name = membership.name;
    this.membership.id = membership.id;
    this.membership.subscribtion = membership.subscribtion;

    this.membership.planId = this.membership.id;
    let period = membership.period
    let mtype;
    switch (this.membership.name.trim()) {
      case 'Premium Plus Rapid':
        mtype = 'premium-plus';
        break
      case 'Premium':
        mtype = 'premium';
        break
      case 'Core':
        mtype = 'core';
        break
      case 'Core Plus Rapid':
        mtype = 'core-plus';
        break
    }
    this.terms.agreed[mtype + period] = true;
    this.paymentFormGroup.patchValue({ how: period })
    this.membershipTryOption = mtype;
  }




  readAndAgree(event) {
    this.signTerms();
  }
  signTerms() {
    let mt = this.membershipTryOption;
    let how = this.paymentFormGroup.value.how;
    this.terms.signRequested = true;
    this.openDocuSign(mt, how);
  }
  openDocuSign(mtype, period) { // MIG

    let ref = this.docuSignDialog.open(DocuSignComponent, {
      width: '55vw',
      height: '75vh',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data: { clickToSign: true, clickToSignData: { mtype, period }, isFromMembership: true }
    });
    ref.afterClosed().subscribe(result => {
      this.terms.signResponded = true;
      this.terms.signRequested = false;
      if (result.agreed) {
        this.terms.stepReady = true;
        this.terms.status = 'signed';
        //this.stepValidated = true;
        this.terms.signDate = new Date().toISOString();
        this.terms.agreed[mtype + period] = true;

        this.membership.planId = result.planId;
        this.membership.intent[mtype + period] = { clickwrapId: result.clickwrapId, clientUserId: result.clientUserId }

      } else {
        this.apiService.removeTermsAndCongitions(result.clickwrapId, result.clientUserId).subscribe((data: HttpResponse<Object>) => {
          this.terms.status = 'unsigned';
          //this.stepValidated = false;
          this.terms.signDate = null;
          this.terms.agreed[mtype + period] = false;
        }, (respError: Error) => { })
      }

    });
    this.socket.once("termsSigned", (event) => {
      ref.close();
    })
  }
  downloadAsPDF(membershipTryOption) {
    let url = this.apiService.getTermsURL(this.paymentFormGroup.value.how, membershipTryOption);
    window.open(url);
  }
  contactUs() {
    this.eventEmitterService.onContact('payment');
  }

}
