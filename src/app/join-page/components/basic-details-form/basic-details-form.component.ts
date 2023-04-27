import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from '@shared/helpers/common';

@Component({
  selector: 'basic-details-form',
  templateUrl: './basic-details-form.component.html',
  styleUrls: ['./basic-details-form.component.scss']
})
export class BasicDetailsFormComponent implements OnInit {

  @Output() goToMoreDetails: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  @Input() accountForm: FormGroup;

  passwordType = 'password';
  confirmPasswordType = 'password';

  public password = true;
  public confirmPassword = true;

  get f(): any {
    return this.accountForm.controls;
  }

  constructor() {}

  ngOnInit(): void {}

  pwdMatchValidator(): void {
    const { password, confirmPassword } = this.accountForm.value;
    if (confirmPassword) {
      if (password !== confirmPassword) {
        this.accountForm.controls.confirmPassword.setErrors({
          mismatch: true,
        });
      } else {
        this.accountForm.controls.confirmPassword.setErrors(null);
      }
    }
  }

  isFieldInvalid(field): boolean {
    return this.f[field].errors && (this.f[field].dirty || this.f[field].touched);
  }

  submit(): void {
    if (this.accountForm.invalid) {
      validateAllFormFields(this.accountForm);
      return;
    }
    this.goToMoreDetails.emit();
  }

  handleIconChange(type: string) {
    if (type === 'password') {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    } else if (type === 'confirmPassword') {
      this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
    }
  }

  cancelButtonClicked() {
    this.cancel.emit();
  }
}
