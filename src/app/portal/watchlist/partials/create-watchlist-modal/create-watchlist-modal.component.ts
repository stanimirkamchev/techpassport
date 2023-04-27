import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "@services/api/api.service";
import { CreateSuccessModalComponent } from "../create-success-modal/create-success-modal.component";

@Component({
  selector: 'create-watchlist-modal',
  templateUrl: './create-watchlist-modal.component.html',
  styleUrls: ['./create-watchlist-modal.component.scss']
})
export class CreateWatchlistModalComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  errMessage = '';
  selectedProductIds: string[] = []

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CreateWatchlistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {
    this.selectedProductIds = this.data.selectedProductIds;
  }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  onSave() {
    const values = this.formGroup.getRawValue();

    this.apiService.createWatchList({
      ...values,
      selectedProductIds: this.selectedProductIds
    }).subscribe(() => {
      this.dialogRef.close('success');

      const ref = this.dialog.open(CreateSuccessModalComponent, {
        width: '720px',
        maxWidth: undefined,
        panelClass: 'modal',
        disableClose: false,
      });

      ref.afterClosed().subscribe(() => {});
    }, (err) => {
      if (err.error.message === 'A watchlist with that name already exists.') {
        this.errMessage = 'A watchlist with that name already exists.';
        this.formGroup.setErrors({
          name: this.errMessage,
        });
      }
    });
  }

  get f(): any {
    return this.formGroup.controls;
  }

  isFieldInvalid(field): boolean {
    return this.f[field].errors && (this.f[field].dirty || this.f[field].touched);
  }
}
