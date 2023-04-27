import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { ModalData } from '../model-data';
export interface ModalData {
    name: string;
    color: string;
}
@Component({
  selector: 'app-cookie-modal',
  templateUrl: './cookie-modal.component.html',
  styleUrls: ['./cookie-modal.component.scss']
})

export class CookieModalComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<CookieModalComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalData){

  }

  accept(): void {
    localStorage.setItem('cookieAccept', 'true');
    this.dialogRef.close();
  }

  noThanks(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

}
