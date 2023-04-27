import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { DocuSignComponent } from '@shared/modals/docu-sign-modal/docu-sign.component';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'plans-modal',
  templateUrl: './plans-modal.component.html',
  styleUrls: ['./plans-modal.component.scss']
})
export class PlansModalComponent implements OnInit {
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

  constructor(
    public dialogRef: MatDialogRef<PlansModalComponent>,
    private apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private docuSignDialog: MatDialog,
    private socket: Socket,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  downloadAsPDF() {
    let url = this.apiService.getTermsURL(this.data.fees, this.data.plan);
    window.open(url);
  }

  readAndAgree() {
    this.signTerms();
  }
  signTerms() {
    let mt = this.data.plan;
    let how = this.data.fees;
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
      data: { clickToSign: true, clickToSignData: { mtype, period } }
    });
    ref.afterClosed().subscribe(result => {
      this.terms.signResponded = true;
      this.terms.signRequested = false;
      if (result.agreed) {
        this.terms.stepReady = true;
        this.terms.status = 'signed';
        // localStorage.setItem('terms', JSON.stringify({
        //   mtype,
        //   period,
        //   status: 'signed'
        // }))
        //this.stepValidated = true;
        this.terms.signDate = new Date().toISOString();
        this.terms.agreed[mtype + period] = true;
      } else {
        this.apiService.removeTermsAndCongitions(result.clickwrapId, result.clientUserId).subscribe((data: HttpResponse<Object>) => {
          this.terms.status = 'unsigned';
          // localStorage.setItem('terms', JSON.stringify({
          //   mtype,
          //   period,
          //   status: 'unsigned'
          // }))
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

  contactUs() {
    this.eventEmitterService.onContact('payment');
  }

}
