import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';

@Component({
  selector: 'app-user-type-modal',
  templateUrl: './user-type-modal.component.html',
  styleUrls: ['./user-type-modal.component.scss']
})
export class UserTypeModalComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<UserTypeModalComponent>, private eventEmitterService: EventEmitterService  ){//@Inject(MAT_DIALOG_DATA) public data: ModalData

  }

  ngOnInit() {
  }
  exit(){
    this.dialogRef.close();
  }
  joinAs(type: string): void {
    this.dialogRef.close();
    this.eventEmitterService.onRegister(type);
  }

}
