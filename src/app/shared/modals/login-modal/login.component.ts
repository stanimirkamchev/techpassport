import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { Router } from '@angular/router';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';

export type samlType = {
  isActive: boolean,
  company: object | null
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginModalComponent {
  titles = [
    'Welcome back!', 'We\'ve sent you a 6-digit code.', 'Reset your password!'
  ];
  loginForm: FormGroup;
  twoFaForm: FormGroup;
  resetForm: FormGroup;
  message = '';
  success = false;
  inProgress = false;
  page = 1;
  forgotView = false;
  passInputType = 'password';
  companies: object[] | null = null;
  saml: samlType = {
    isActive: false,
    company: null
  };

  constructor(
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private eventEmitterService: EventEmitterService
  ) {
    this.loginForm = fb.group({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    this.twoFaForm = fb.group({
      code: new FormControl('', [Validators.required, Validators.minLength(6)]),
      rememberMe: new FormControl(false),
    });
    this.resetForm = fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  exit() {
    this.dialogRef.close();
  }

  actionDisabled() {
    if (this.forgotView) {
      return this.inProgress === true || this.loginForm.controls.email.status !== 'VALID';
    }

    return this.inProgress === true || this.loginForm.status !== 'VALID';

  }
  confirmDisabled() {
    return this.inProgress === true || this.twoFaForm.status !== 'VALID';
  }
  restDisabled() {
    return this.inProgress === true || this.resetForm.status !== 'VALID';
  }

  changePassInput(): any {
    if (this.passInputType === 'password') {
      this.passInputType = 'text';
    }
    else {
      this.passInputType = 'password';
    }
  }

  async twoFA() {
    if (this.twoFaForm.status !== 'VALID') {
      return;
    }

    this.inProgress = true;
    this.message = '';

    let action = 'login2fa';
    if (this.forgotView) {
      action = 'reset2fa';
    }
    this.apiService[action](this.twoFaForm.value).subscribe((data: HttpResponse<Object>) => {
      if (action === 'reset2fa') {
        this.message = '';
        this.success = false;
        this.inProgress = false;
        this.page = 3;
        this.passInputType = 'password';
      } else {
        this.message = 'Success!';
        this.success = true;
        setTimeout(() => {
          this.dialogRef.close();
          this.eventEmitterService.onLoggedin();
        }, 1000);
      }
      //  self.page++;
    }, (respError: Error) => {
      try {
        this.message = (respError as any).error.message;
      } catch (error) {
        this.message = (respError as any).message; // or statusText
      }
      this.inProgress = false;
    });
  }


  async resend() {
    this.apiService.login2faResend(this.forgotView)
      .subscribe((data: HttpResponse<Object>) => {
        if ((data.body as any).status === 'success') {
          this.message = 'We have sent you new code!';
        }
      }, (respError: Error) => {
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = (respError as any).message; // or statusText
        }
      });
  }
  forgotPass() {
    this.forgotView = !this.forgotView;
  }
  async doResetPass() {
    if (this.resetForm.status !== 'VALID') {
      return;
    }
    if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
      this.message = 'Password doesn\'t match!';
      this.success = false;
      return;
    }

    this.inProgress = true;
    this.message = '';
    this.apiService.setNewPassword(this.resetForm.value.password)
      .subscribe((_: HttpResponse<any>) => {

        this.message = 'Your password has been changed!';
        this.success = true;
        this.resetForm.reset();

        setTimeout(() => {
          this.dialogRef.close();
          this.eventEmitterService.onLoggedin();
        }, 1000);

        this.ref.detectChanges();
        this.inProgress = false;
      }, (respError: Error) => {
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = (respError as any).message; // or statusText
        }
        this.success = false;
        this.inProgress = false;
      });
  }
  doAction() {
    if (this.forgotView) {
      if (this.loginForm.controls.email.status === 'VALID') {
        this.resetPass();
      }
    } else {
      if (this.loginForm.status === 'VALID') {
        this.logIn();
      }
    }
  }

  async resetPass() {
    this.message = '';
    this.inProgress = true;
    this.apiService.resetPassword(this.loginForm.value.email)
      .subscribe((_: HttpResponse<any>) => {
        this.message = '';
        this.success = false;
        this.loginForm.reset();
        this.page = 2;

        this.ref.detectChanges();
        this.inProgress = false;
      }, (respError: Error) => {
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = (respError as any).message; // or statusText
        }
        this.inProgress = false;
      });
  }

  async logIn() {
    this.message = '';
    this.inProgress = true;
    this.apiService.login(this.loginForm.value)
      .subscribe((data: HttpResponse<any>) => {
        if ((data.body as any).passwordChangeRequired === true) {
          this.message = 'Password change required!';
          this.success = false;
          setTimeout(() => { // time out for user to read message
            this.page = 2;
            this.forgotView = true;
            this.resetPass();
            this.loginForm.reset();
          }, 3000);

          return;
        }
        if ((data.body as any).t === true) {
          this.message = 'Success!';
          this.success = true;
          setTimeout(() => { // time out for user to read message
            this.dialogRef.close();
            this.eventEmitterService.onLoggedin();
          }, 1500);
          // TODO: send changed SAML (this.saml)

          return;
        }
        this.message = '';
        this.success = false;
        this.loginForm.reset();
        this.page = 2;

        this.ref.detectChanges();
        this.inProgress = false;
      }, (respError: Error) => {
        try {
          this.message = (respError as any).error.message;
        } catch (error) {
          this.message = (respError as any).message; // or statusText
        }
        this.inProgress = false;
      });
  }
}
