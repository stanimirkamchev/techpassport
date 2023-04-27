import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormControl, FormArray} from '@angular/forms';
import {ApiService} from '@services/api/api.service';
import {HttpResponse} from '@angular/common/http';
import {PopUpService} from '../../shared/pop-up-service';

@Component({
  selector: 'on-board-modal',
  templateUrl: './on-board-modal.component.html',
  styleUrls: ['./on-board-modal.component.scss']
})
export class OnBoardModalComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private popUpService: PopUpService,
    public dialogRef: MatDialogRef<OnBoardModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.item) {
      this.data.orgId = this.data.item.orgId
      this.data.company = this.data.item.company
    }
  }

  public success = false;
  public message = '';
  public requestInProgress = false;
  public isCancelInvited = false

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  async onSendOnBoard() {
    if (this.data.orgId) {
      this.requestInProgress = true;
      this.message = 'Your invitations have been submitted. You can follow their progress in the admin area';
      this.success = true;
      this.popUpService.attachData({success: null, items: [this.data.item]});

      this.apiService.onBoardSupplier(this.data.orgId).subscribe(
        (data: HttpResponse<any>) => {
          this.popUpService.attachData({success: data && (data as any).success, items: [this.data.item]});
        },
        (respError: Error) => {
          try {
            this.message = (respError as any).error.message;
            this.popUpService.attachData({success: false, items: [this.data.item]});
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
