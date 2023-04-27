import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-membership-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent implements OnInit {
  public nameForm: FormGroup;
  public requestInProgress: boolean = false;
  public message: string;
  constructor(public apiService: ApiService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfileModalComponent>) {

    this.nameForm = fb.group({
      firstName: new FormControl('', Validators.minLength(2)),
      lastName: new FormControl('', Validators.minLength(2)),
      jobTitle: new FormControl('', Validators.minLength(2)),
      phone: new FormControl('', Validators.minLength(10)),
      email: new FormControl('', Validators.minLength(3))
    });
  }

  ngOnInit() {
    this.apiService.userProfile().subscribe((data: HttpResponse<Object>) => {
      this.nameForm.patchValue(data.body);
    }, (respError: Error) => {

    })
  }
  update() {
    this.apiService.updateUserProfile({ ...this.nameForm.value }).subscribe((data: HttpResponse<Object>) => {
      this.nameForm.patchValue(data.body);
      this.dialogRef.close();
    }, (respError: Error) => {

    })
  }
  cancel() {
    this.dialogRef.close();
  }

}
