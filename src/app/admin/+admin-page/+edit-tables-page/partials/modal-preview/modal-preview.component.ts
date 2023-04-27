import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'modal-preview',
  templateUrl: './modal-preview.component.html',
  styleUrls: ['./modal-preview.component.scss']
})
export class ModalPreviewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  understood(): void {
    this.dialogRef.close();
  }

  ngOnInit() { }
}
