import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-membership-modal',
  templateUrl: './membership-modal.component.html',
  styleUrls: ['./membership-modal.component.scss']
})
export class MembershipModalComponent implements OnInit {
  public payment: any = {};
  public subscription: any = {};
  public removeSubscribrionAlert = false;
  public requestInProgress = false;
  constructor(
    public apiService: ApiService,
    public dialogRef: MatDialogRef<MembershipModalComponent>) {
    this.apiService.getMembershipSubscription().subscribe((data: HttpResponse<Object>) => {
      this.payment = (data.body as any).payment;
      this.subscription = (data.body as any).subscription;
    }, (respError: Error) => {
      console.log("respError", respError);
    })
  }

  ngOnInit() {
  }
  removeSubscribrion() {
    this.removeSubscribrionAlert = true;
  }
  doRemoveSubscribrion(doIt: boolean) {
    if (!doIt)
      this.removeSubscribrionAlert = false;

  };
  cancel() {
    this.dialogRef.close();
  }
  getDateString(date: number) {
    return new Date(date * 1000).toISOString();
  }

}
