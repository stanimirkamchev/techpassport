import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'disabled-user-portal',
  templateUrl: './disabled-user-portal.component.html',
  styleUrls: ['./disabled-user-portal.component.scss']
})
export class DisabledUserPortalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DisabledUserPortalComponent>,

  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }
}
