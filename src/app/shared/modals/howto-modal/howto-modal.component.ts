import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-howto-modal',
  templateUrl: './howto-modal.component.html',
  styleUrls: ['./howto-modal.component.scss']
})
export class HowtoModalComponent implements OnInit {

  constructor(  public dialogRef: MatDialogRef<HowtoModalComponent> ) { }

  ngOnInit() {
  }
  exit(){
    this.dialogRef.close();
  }

}
