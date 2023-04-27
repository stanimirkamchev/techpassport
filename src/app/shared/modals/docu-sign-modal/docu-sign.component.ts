import { Component, OnInit, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
export interface DocuSignModalData {
  url: string;
  handshakeID?: string;
  pocID?: string;
  clickToSign?: boolean;
  clickToSignData?: any;
}
declare const docuSignClick: any;

@Component({
  selector: 'app-docu-sign',
  templateUrl: './docu-sign.component.html',
  styleUrls: ['./docu-sign.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocuSignComponent implements OnInit {
  public loading = true;
  public agreed = false;
  public done = false;
  public showText = false;
  private dsData = {} as any;
  isFromMemberShip = false;
  isFromSupplierJoin = false;

  constructor(
    private apiService: ApiService,
    private socket: Socket,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DocuSignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocuSignModalData) {
    if (data) {
      this.isFromMemberShip = (this.data as any).isFromMembership || false;
      this.isFromSupplierJoin = (this.data as any).isFromSupplierJoin || false;
    }
  }

  async ngOnInit() {
    if (this.data?.handshakeID) {
      this.socket.on('termsSigned', (event) => { // termsSigned
        this.dialogRef.close();
      });
      // let action = 'pocSign'; //ndaSign
      // ndaSign this.data
      let contractTypeFunction;
      let id;

      if (this.data?.pocID) {
        contractTypeFunction = 'pocSign';
        id = this.data.pocID;
      } else {
        contractTypeFunction = 'ndaSign';
        id = this.data.handshakeID;
      }
      this.apiService[contractTypeFunction](id).subscribe(
        (data: HttpResponse<any>) => {
          const body = data.body as any;
          if (body.status === 'started') {
            const url = this.apiService.getNDASignURL(body.id);
            this.data.url = url;
          }
          this.loading = false;
          if (!this.loading) {
            setTimeout(() => {
              this.showText = true;
              this.cd.detectChanges();
            }, 2800);
          }
        },
        (respError: Error) => {
          console.log('respError', respError);
          this.loading = false;
        }
      );
    } else if (this.data?.url) {
      this.loading = false;
      if (!this.loading) {
        setTimeout(() => {
          this.showText = true;
          this.cd.detectChanges();
        }, 2800);
      }
    }
    else if (this.data?.clickToSign === true) {
      const _this = this;
      this.loading = true;
      this.apiService.getTermsAndCongitions(this.data.clickToSignData.mtype, this.data.clickToSignData.period)
        .subscribe(
          (data: HttpResponse<any>) => {
            const body = data.body as any;
            _this.dsData = body;
            _this.loading = false;
            if (!_this.loading) {
              setTimeout(() => {
                this.showText = true;
                this.cd.detectChanges();
              }, 2800);
            }
            docuSignClick.Clickwrap.render({
              environment: body.environment,
              accountId: body.accountId,
              clickwrapId: body.clickwrapId,
              clientUserId: body.email,
              onAgreed() {
                _this.agreed = true;
                _this.done = true;
              },
              onDeclined() {
                _this.dialogRef.close({ agreed: false, clickwrapId: body.clickwrapId, clientUserId: body.email, planId: body.planId });
              }
            }, '#ds-terms-of-service');


          },
          (respError: Error) => {

          }
        );
    }
  }

  onAgree() {
    this.dialogRef.close({ agreed: true });
  }
  exit() {
    this.dialogRef.close({ agreed: this.agreed, clickwrapId: this.dsData.clickwrapId, clientUserId: this.dsData.email, planId: this.dsData.planId });
  }

}
