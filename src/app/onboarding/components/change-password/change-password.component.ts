import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { ApiService } from '@services/api/api.service';
import {MustMatch} from "../../../common/validations/mustmatch";
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  templateUrl: './change-password.component.html',
  selector: 'change-password',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent extends Destroyable implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%()\}\{\]\[^&£*-.,_]).{8,}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {
      validator: MustMatch('password', 'confirmPassword'),
    })

    this.resetForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(changes => this.onChange(changes));
  }

  onChange(changes: any) {
  }

  public onSubmit() {
    const value = this.resetForm.getRawValue();
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    this.dialog.open(ConfirmationModalComponent, {
      width: '250px',
    }).afterClosed().subscribe(res => {
      if(res) {
        this.loading = true;

        this.apiService.updateUserPassword(value.password).subscribe((res) => {
          this.submitted = false;
          this.loading = false;
          this.resetForm.reset();
        }, () => {
          this.submitted = false;
          this.loading = false;
        });
      }
    })

  }
}
