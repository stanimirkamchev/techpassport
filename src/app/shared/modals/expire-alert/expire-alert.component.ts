import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '@services/api/api.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
//import { MatDialogModule } from '@angular/material/dialog';
//import { ModalData } from '../model-data';
export interface ExpireAlertModalData {
    expiresInSeconds: number;
}


@Component({
  selector: 'app-expire-alert',
  templateUrl: './expire-alert.component.html',
  styleUrls: ['./expire-alert.component.scss']
})
export class ExpireAlertComponent implements OnInit {
  public expiredYet = false;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ExpireAlertComponent>,
    private eventEmitterService: EventEmitterService,
    @Inject(MAT_DIALOG_DATA) public data: ExpireAlertModalData,
    private apiService: ApiService){
  }

  ngOnInit() {
    let interval = setInterval( ()=> {
          if ( this.data.expiresInSeconds < 1){
            clearInterval(interval);
            this.expiredYet = true;
            //this.dialogRef.close();
            return //and clos
          }
          this.data.expiresInSeconds--;
      }, 1000)
  }

  exit(){
      this.dialogRef.close();
  }

  login(){
      //
      this.dialog.closeAll();
      this.eventEmitterService.onLogin();
      //this.eventEmitterService.onCloseAll();// TO DO
      //this.dialogRef.close();
      //
  }
  renew(){
      //
      this.apiService.renewSession().subscribe((data: HttpResponse<Object>)=>{
          this.dialogRef.close();
      },(respError: Error) => {
          this.dialogRef.close();
      })
      //
  }

}
