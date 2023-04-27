import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: 'create-success-modal',
  templateUrl: './create-success-modal.component.html',
  styleUrls: ['./create-success-modal.component.scss']
})
export class CreateSuccessModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CreateSuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  goToMarketPlace() {
    this.router.navigate(['/portal'], { queryParams: { page: 'market' } });
    this.dialogRef.close();
  }
}
