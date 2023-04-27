import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormControl, FormArray} from '@angular/forms';
import {ApiService} from '@services/api/api.service';
import {HttpResponse} from '@angular/common/http';
import {PopUpService} from '../../shared/pop-up-service';
@Component({
  selector: 'invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss']
})
export class InviteModalComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private popUpService: PopUpService,
    public dialogRef: MatDialogRef<InviteModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.items) {
      this.data.items = this.data.items.map(obj => ({...obj, isChecked: true}))
      this.isCancelInvited = data.isCancelInvited
    }
  }

  public inviteFormGroup: FormGroup;
  public success = false;
  public message = '';
  public requestInProgress = false;
  public checkboxes: any[] = [];
  public isCancelInvited = false

  ngOnInit() {
    this.data.items.forEach((i: any) => {
      this.onCheckboxChange(i.isChecked, i.orgId)
    })
  }

  cancel() {
    this.dialogRef.close();
  }

  onCheckboxChange(checked: boolean, id: number) {

    const idx = this.checkboxes.indexOf(id);
    if (idx !== -1) {
      this.checkboxes.splice(idx, 1);
    } else {
      this.checkboxes.push(id)
    }
  }

  async sendInvite() {
    if (this.checkboxes.length > 0) {
      this.requestInProgress = true;
      this.message = 'Your invitations have been submitted. You can follow their progress in the admin area';
      this.success = true;
      this.popUpService.attachData({success: null, items: this.checkboxes});

      this.apiService.inviteSuppliers(this.checkboxes).subscribe(
        (data: HttpResponse<any>) => {
          this.popUpService.attachData({success: data && (data as any).success, items: this.checkboxes});
        },
        (respError: Error) => {
          try {
            this.message = (respError as any).error.message;
            this.popUpService.attachData({success: false, items: this.checkboxes});
          } catch (error) {
            this.message = respError.message;
          }
          this.requestInProgress = false;
        }
      );
    }
  }

  async cancelInvited() {
    if (this.checkboxes.length > 0) {
      this.popUpService.attachData({success: null, items: this.checkboxes});
      this.requestInProgress = true;
      this.apiService.cancelInvitedSuppliers(this.checkboxes).subscribe(
        (data: HttpResponse<any>) => {
          this.popUpService.attachData({success: data && (data as any).success, items: this.checkboxes});
        },
        (respError: Error) => {
          try {
            this.message = (respError as any).error.message;
            this.popUpService.attachData({success: false, items: this.checkboxes});
          } catch (error) {
            this.message = respError.message;
          }
          this.requestInProgress = false;
        }
      );

      this.cancel()
    }
  }
}
