import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './add-solution-modal.component.html',
  styleUrls: ['./add-solution-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSolutionModalComponent implements OnInit {

  solutionTypes = [
    {
      label: "Cloud based productivity software",
      value: "Cloud based productivity software"
    },
    {
      label: "Web referencing tools",
      value: "Web referencing tools"
    },
  ]

  form: FormGroup
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddSolutionModalComponent>) {

  }

  ngOnInit() {
    this.formBuilder()
  }

  formBuilder() {
    this.form = this.fb.group({
      type: [undefined, Validators.required],
      name: [undefined, Validators.required]
    })
  }

  onSubmit() {
    this.dialogRef.close(this.form.value)
  }
}
