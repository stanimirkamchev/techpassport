import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api/api.service';
import * as inviteSuppliersActions from '../../invite-suppliers-module/store/index.actions';


@Component({
  selector: 'tpp-note-modal',
  templateUrl: './tpp-note-modal.component.html',
  styleUrls: ['./tpp-note-modal.component.scss']
})
export class TppNoteModalComponent implements OnInit {
  public success = false;
  public requestInProgress = false;
  public inviteFormGroup: FormGroup;
  public message: string;
  public contentValidationMessage;

  constructor(
    public dialogRef: MatDialogRef<TppNoteModalComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private changeDetector: ChangeDetectorRef,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.inviteFormGroup = fb.group({
      content: new FormControl(data.tppNote || '', Validators.minLength(4))
    });
  }

  ngOnInit(): void { }

  isValid() {
    const contentIsValid = Boolean(this.inviteFormGroup.controls.content.value.length > 4);
    const contentInputIsDirty = this.inviteFormGroup.controls.content.dirty;
    if (!contentIsValid && contentInputIsDirty) {
      this.contentValidationMessage = 'Don\'t forget to leave us a note!';
    } else {
      this.contentValidationMessage = '';
    }
    return contentIsValid;
  }

  invite() {
    this.requestInProgress = true;
    this.apiService.invitationUpdateNote(this.data.invitationId, this.inviteFormGroup.controls.content.value).subscribe(
      (_: HttpResponse<object>) => {
        this.message = 'Thank you for your submission. Your note has been saved!';
        this.success = true;
        this.requestInProgress = false;
        this.store.dispatch(inviteSuppliersActions.loadDataTable());
        this.changeDetector.detectChanges();
      },
      (respError: Error) => {
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = respError.message;
        } finally {
          this.requestInProgress = false;
        }
      }
    );
  }

  exit() {
    this.dialogRef.close();
  }
}
