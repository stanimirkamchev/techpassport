import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-modal-alert',
  templateUrl: './preview-modal-alert.component.html',
  styleUrls: ['./preview-modal-alert.component.scss']
})
export class PreviewModalAlertComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('data PreviewModalAlertComponent', data);
  }

  ngOnInit() {

  }

}
