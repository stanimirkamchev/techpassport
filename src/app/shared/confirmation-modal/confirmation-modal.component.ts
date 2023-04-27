import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';

export interface Confirmation {
  title?: string;
  subtitle?: string;
  confirmation?: string;
  resolve?: any;
  isSamlAuthenticated?: boolean
}

@Component({
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent implements OnInit {

  constructor(
    public auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: Confirmation) {
  }

  ngOnInit() {
    if(this.data && this.data.isSamlAuthenticated) {
      this.auth.getUser()
    }
  }

}
