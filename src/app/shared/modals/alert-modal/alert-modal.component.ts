

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';

//import { ModalData } from '../model-data';
export interface AlertModalData {
    title: string;
    message: string;
    links: Array<Object>;
    actions: Array<Object>;
    isQuestion?: boolean;
    progress?: boolean;
    ssoLoginAttempt?: boolean;
}

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})

export class AlertModalComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public dialogRef: MatDialogRef<AlertModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertModalData){
  }

  understood( action: string): void {
    this.dialogRef.close(action);
    if(this.data.ssoLoginAttempt) {
      this.auth.logout();
    }
  }


  ngOnInit() {

  }

}
