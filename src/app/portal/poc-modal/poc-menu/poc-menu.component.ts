import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { inputs } from '@syncfusion/ej2-angular-calendars/src/calendar/calendar.component';

export interface PocMenuComponentData {
  timeTrial
  howManyUsers
  howManyCopies
  chooseSupplier
  specialConditions
  includedTerritories
  hostingDescritpion
  software
  price
  docOtherMateril
}

@Component({
  selector: 'app-poc-menu',
  templateUrl: './poc-menu.component.html',
  styleUrls: ['./poc-menu.component.scss']
})


export class PocMenuComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PocMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PocMenuComponentData) {
  }

  ngOnInit() {

  }
}

