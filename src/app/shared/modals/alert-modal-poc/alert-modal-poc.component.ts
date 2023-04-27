

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { ModalData } from '../model-data';
export interface AlertModalPocData {
    title: string;
    notification1:boolean;
    messageList:Array<string>;
    notification2:string;
    notification3:boolean;
    messageList3:Array<string>;
    notification4:string;
    notification5:string;
    links: Array<Object>;
    actions: Array<Object>;

}

@Component({
  selector: 'app-alert-modal-poc',
  templateUrl: './alert-modal-poc.component.html',
  styleUrls: ['./alert-modal-poc.component.scss']
})

export class AlertModalPocComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertModalPocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertModalPocData){
  }

  understood( action: string): void {
    this.dialogRef.close(action);
  }


  ngOnInit() {

  }

}
