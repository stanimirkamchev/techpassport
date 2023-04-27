import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './add-tag-modal.component.html',
  styleUrls: ['./add-tag-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTagModalComponent implements OnInit {

  form: FormGroup
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddTagModalComponent>) {

  }

  ngOnInit() {
    this.formBuilder()
  }

  formBuilder() {
    this.form = this.fb.group({
      name: [undefined, Validators.required]
    })
  }

  onSubmit() {
    this.dialogRef.close(this.form.value)
  }
}
