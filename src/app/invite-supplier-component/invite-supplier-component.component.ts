import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import * as inviteSuppliersSelectors from '../invite-suppliers-module/store/index.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'invite-supplier-component',
  templateUrl: './invite-supplier-component.component.html',
  styleUrls: ['./invite-supplier-component.component.scss']
})
export class InviteSupplierComponentComponent implements OnInit {

  public success = false;
  public requestInProgress = false;
  public inviteFormGroup: FormGroup;
  public message: string;
  constructor(
    public dialogRef: MatDialogRef<InviteSupplierComponentComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.inviteFormGroup = fb.group({
      email: new FormControl('', Validators.email),
      website: new FormControl('', Validators.minLength(4)),
      functionality: new FormControl(''),
      content: new FormControl('', Validators.minLength(4))
    });
  }

  ngOnInit(): void {

  }

  isValid() {
    return (this.inviteFormGroup.value.email && this.inviteFormGroup.get('email').valid)
      || this.inviteFormGroup.value.website
      || this.inviteFormGroup.value.functionality;
  }

  invite() {
    this.requestInProgress = true;
    this.apiService.customerInviteSupplier(this.inviteFormGroup.value).subscribe(
      (data: HttpResponse<any>) => {
        this.message = 'Thank you for your submission. Your invitation has been sent!';
        this.success = true;
        this.store.select(inviteSuppliersSelectors.selectData).subscribe();
      },
      (respError: Error) => {
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = respError.message; // or statusText
        }
        this.requestInProgress = false;
      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }

}
