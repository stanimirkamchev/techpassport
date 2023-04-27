import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api/api.service';
import * as inviteSuppliersActions from '../store/index.actions';

@Component({
  selector: 'request-update-modal',
  templateUrl: './request-update-modal.component.html',
  styleUrls: ['./request-update-modal.component.scss']
})
export class RequestUpdateModalComponent implements OnInit {

  public success = true;

  constructor(
    public dialogRef: MatDialogRef<RequestUpdateModalComponent>,
    private apiService: ApiService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.invite();
  }

  invite() {
    this.apiService.invitationRequestDate(this.data.invitationId).subscribe(
      (_: HttpResponse<object>) => {
        this.store.dispatch(inviteSuppliersActions.loadDataTable());
      },
      (respError: Error) => {
        try {
        } catch (error) {
        }
      }
    );
  }

  exit() {
    this.dialogRef.close();
  }
}
