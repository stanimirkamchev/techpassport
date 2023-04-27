import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'add-business-group-component',
  templateUrl: './add-business-group-component.component.html',
  styleUrls: ['./../add-team-member-modal/add-team-member.component.scss']
})
export class AddBusinessGroupComponent implements OnInit {
  groupFormGroup: FormGroup;
  requestInProgress: boolean = false;
  message: string = '';
  success: boolean;
  entities = [];
  editMode: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<AddBusinessGroupComponent>,
    private fb: FormBuilder,
    public apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) {


    let name = '';
    let entity = '';
    if (data.element?._id) {
      this.editMode = true;
      name = data.element.name;
      entity = data.element.entityID
    }

    this.groupFormGroup = fb.group({
      name: new FormControl(name, [Validators.minLength(2), Validators.required]),
      entity: new FormControl(entity, [Validators.required]),
    })

    this.getEntieties();
  }
  getEntieties() {
    this.apiService.getEntieties().subscribe((data: HttpResponse<Object>) => {
      this.entities = data as any;
      if (!this.editMode)
        this.groupFormGroup.patchValue({ 'entity': this.entities[0]._id })
    }, (respError: Error) => {

    })
  }

  ngOnInit(): void {


  }
  confirm() {
    this.requestInProgress = true;
    if (this.editMode) {
      this.apiService.updateBusinessGroup(this.data.element._id, this.groupFormGroup.value).subscribe((data: HttpResponse<Object>) => {
        this.message = "Success";
        this.success = true;
        this.requestInProgress = false;
        this.dialogRef.close();
      }, (respError: Error) => {
        this.success = false;
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = respError.message; // or statusText
        }
        this.requestInProgress = false;
      })
    } else {
      this.apiService.addBusinessGroup(this.groupFormGroup.value).subscribe((data: HttpResponse<Object>) => {
        this.message = "Success";
        this.success = true;
        this.requestInProgress = false;
        this.dialogRef.close();
      }, (respError: Error) => {
        this.success = false;
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = respError.message; // or statusText
        }
        this.requestInProgress = false;
      })
    }
  }
  resetForm() {
    this.groupFormGroup.reset();
  }
  exit() {
    // if members.length > 0 alert
    this.dialogRef.close();
  }


}
