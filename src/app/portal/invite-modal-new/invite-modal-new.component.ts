import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api/api.service';
import * as inviteSuppliersActions from '../../invite-suppliers-module/store/index.actions';

@Component({
  selector: 'invite-modal-new',
  templateUrl: './invite-modal-new.component.html',
  styleUrls: ['./invite-modal-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteModalNewComponent implements OnInit {

  public success = false;
  public requestInProgress = false;
  public inviteFormGroup: FormGroup;
  public message: string;
  public webSiteValidationMessage;
  public contentValidationMessage;
  public emailValidationMessage;
  public step = 0;

  constructor(
    public dialogRef: MatDialogRef<InviteModalNewComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private changeDetector: ChangeDetectorRef,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const webSiteRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.inviteFormGroup = fb.group({
      email: new FormControl('', Validators.email),
      website: new FormControl('', [
        Validators.minLength(4),
        Validators.pattern(webSiteRegex)
      ]
      ),
      // functionality: new FormControl(''),
      content: new FormControl('', Validators.minLength(4))
    });
  }

  ngOnInit(): void { }

  isValid() {
    switch (this.step) {
      case 0:

        let emailIsValid;
        const isEmailDirty = this.inviteFormGroup.controls.email.dirty;
        const websiteIsDirty = this.inviteFormGroup.controls.website.dirty;
        if (isEmailDirty) {
          emailIsValid = this.inviteFormGroup.value.email && this.inviteFormGroup.get('email').valid;
          if (!emailIsValid) {
            this.emailValidationMessage = 'Enter a valid email address';
          } else {
            this.emailValidationMessage = '';
          }
        }

        const websiteIsValid = (Boolean(this.inviteFormGroup.value.website) && this.inviteFormGroup.get('website').valid);
        if (websiteIsDirty) {
          if (!websiteIsValid) {
            this.webSiteValidationMessage = 'Enter a valid website';
          } else {
            this.webSiteValidationMessage = '';
          }
        }

        return emailIsValid || websiteIsValid;
      case 1:
        const contentIsValid = Boolean(this.inviteFormGroup.controls.content.value.length > 4);
        const contentInputIsDirty = this.inviteFormGroup.controls.content.dirty;
        if (!contentIsValid && contentInputIsDirty) {
          this.contentValidationMessage = 'Don\'t forget to leave us a note!';
        } else {
          this.contentValidationMessage = '';
        }
        return contentIsValid;
    }
  }

  invite() {
    this.requestInProgress = true;
    this.apiService.customerInviteSupplier(this.inviteFormGroup.value).subscribe(
      (_: HttpResponse<object>) => {
        this.message = 'Thank you for your submission. Your invitation has been sent!';
        this.success = true;
        this.requestInProgress = false;
        this.store.dispatch(inviteSuppliersActions.loadDataTable());
        this.changeDetector.detectChanges();
      },
      (respError: Error) => {
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = respError.message; // or statusText
        } finally {
          this.requestInProgress = false;
        }
        // this.requestInProgress = false;
      }
    );
  }

  cancel() {
    if (this.step !== 0) {
      this.step--;
    } else {
      this.dialogRef.close();
    }
  }

  exit() {
    this.dialogRef.close();
  }

  increaseStep() {
    this.step++;
  }

  inviteSupplier() {
    this.step = 0;
    this.success = false;
    this.requestInProgress = false;

    this.inviteFormGroup.reset({
      email: '',
      website: '',
      functionality: '',
      content: '',
    });
  }

}
