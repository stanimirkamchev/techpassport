import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TweenMax, TimelineLite, Power1, Power4 } from 'gsap/all'; // TweenMax, TimelineLite, Power1, Back, TimeLine
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
// import { OnExecuteData, ReCaptchaV3Service } from 'ng-recaptcha'
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { AuthService } from '@auth0/auth0-angular';

let passwordStrength = 0;
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }

    if (passwordStrength < 3) {
      control.setErrors({ weak: true });
    } else {
      control.setErrors(null);
    }
  };
}
/*
export function PwdStrength(controlName: string, strength: number) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];


        // set error on matchingControl if validation fails
        if ( strength < 0 ) {
            control.setErrors({ weak: true });
        } else {
            control.setErrors(null);
        }
    }
}
*/
/*
export function PwdStrength(controlName: string, strength: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = strength < 3;
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}
*/
@Component({
  selector: 'app-user-onboarding-modal',
  templateUrl: './user-onboarding-modal.component.html',
  styleUrls: ['./user-onboarding-modal.component.scss']
})
export class UserOnboardingModalComponent implements OnInit {

  tl = null;
  page = 1;
  nameForm: FormGroup;
  profileForm: FormGroup;
  verifyForm: FormGroup;
  pagesForms: Array<FormGroup>;
  success = false;
  message = '';
  requestInProgress = false;
  isSamlAuthenticated = false;
  email = null;
  fieldErrors = {};
  fieldNames = {
    firstName: 'First Name',
    lastName: 'Surname',
    jobTitle: 'Job Title',
    email: 'E-mail',
    phone: 'Phone',
    password: 'Password',
    confirmPassword: 'Confirm Password'
  };
  mobNumberPattern = '^[0-9]{11}$'; // ((\\+44-?)|0)?
  passwordStrength = 0;
  passInputType = 'password';

  constructor(
    public auth: AuthService,
    private dialogRef: MatDialogRef<UserOnboardingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertDialog: MatDialog,
    private fb: FormBuilder,
    private apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) {
    let email = '';
    if (data && data.token) {
      this.page = 2;
      this.apiService.checkInvToken(data.token).subscribe((data: HttpResponse<Object>) => {
      }, (respError: Error) => {
        try {
          this.message = (respError as any).error.message;

        } catch (error) {
          this.message = (respError as any).message; // or statusText
        }
      });
    }
    if (data && data.email) {
      email = data.email;
    }
    this.email = data.email;

    if (data && data.isSamlAuthenticated) {
      this.isSamlAuthenticated = data.isSamlAuthenticated;
    }

    this.nameForm = fb.group({
      firstName: new FormControl('', Validators.minLength(2)),
      lastName: new FormControl('', Validators.minLength(2)),
      jobTitle: new FormControl('', Validators.minLength(2)),
      phone: new FormControl('')
    });
    this.profileForm = fb.group({
      email: new FormControl(email, Validators.email),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.verifyForm = fb.group(
      { code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('[0-9]*')]) }
    );
    this.pagesForms = [null, this.nameForm, this.profileForm, this.verifyForm];
  }

  ngOnInit() {
  }
  changePassInput(): any {
    if (this.passInputType === 'password') {
      this.passInputType = 'text';
    }
    else {
      this.passInputType = 'password';
    }
  }

  strengthChange(event) {
    this.passwordStrength = passwordStrength = event;
    this.message = '';
  }

  letGoMouseOver() {
    this.tl.pause();
  }

  letGoMouseOut() {
    this.tl.resume();
  }

  saveUser() {
    this.requestInProgress = true;
    const userForm = {
      ...this.nameForm.value,
      email: this.email,
      isSamlAuthenticated: this.isSamlAuthenticated
    };
    if (this.pagesForms[this.page - 1].status === 'VALID') {
      this.apiService.registerSSO({ ...userForm, ...{ inviteToken: this.data.token } })
        .subscribe((data: HttpResponse<any>) => {
          this.success = true;
          if ((data.body as any).message) {
            this.message = 'Success! ' + (data.body as any).message;
          } else {
            this.message = 'Success!';
          }

          setTimeout(() => {
            this.dialogRef.close();
          }, 1800);
          this.auth.loginWithRedirect({
            screen_hint: 'login',
            appState: {
              target: window.location.pathname
            }
          });
          this.message = '';
          this.profileForm.reset();
          this.nameForm.reset();
          this.page++;
        }, (respError: Error) => {
          try {
            this.message = (respError as any).error.message;
          } catch (error) {
            this.message = (respError as any).message; // or statusText
          }
          this.requestInProgress = false;
        });
    }
  }

  async incPage(self) {
    self.success = false;
    self.message = ''; //
    switch (self.page) {
      case 3: {
        this.requestInProgress = true;
        this.apiService.registerThroughInvite({ ...self.nameForm.value, ...self.profileForm.value, ...{ inviteToken: this.data.token } })
          .subscribe(
            (data: HttpResponse<any>) => {
              self.message = '';
              self.profileForm.reset();
              self.nameForm.reset();
              self.page++;
              this.requestInProgress = false;
            },
            (respError: Error) => {
              try {
                self.message = (respError as any).error.message;
              } catch (error) {
                self.message = respError.message; // or statusText
              }
              this.requestInProgress = false;
            }
          );
        break;
      } case 4: {
        this.requestInProgress = true;
        self.apiService.register2fa(self.verifyForm.value.code)
          .subscribe((data: HttpResponse<any>) => {
            // verifyForm: FormGroup;
            self.success = true;
            let timeout = 1800;
            if ((data.body as any).message) {
              self.message = 'Success! ' + (data.body as any).message;
              timeout = 10000;
            } else {
              self.message = 'Success!';
            }

            setTimeout(() => {
              this.dialogRef.close();
              this.router.navigateByUrl('/portal');
              this.eventEmitterService.onLoggedin();
            }, timeout);
            //  self.page++;
          }, (respError: Error) => {
            try {
              self.message = (respError as any).error.message;
            } catch (error) {
              self.message = (respError as any).message; // or statusText
            }
            this.requestInProgress = false;
          });
        break;
      } default: {
        this.requestInProgress = false;
        self.message = '';
        self.page++;
      }

    }

  }

  letsGo() {
    if (this.page === 1) {
      this.tl.pause();
    }
    if (this.pagesForms[this.page - 1] == null || this.pagesForms[this.page - 1].status === 'VALID') {
      this.incPage(this);
    } else {
      if (this.pagesForms[this.page - 1] && this.pagesForms[this.page - 1].invalid === true) {
        for (const name in this.pagesForms[this.page - 1].controls) {


          if (name === 'confirmPassword' || name === 'password') {
            if (this.pagesForms[this.page - 1].controls.confirmPassword.value !== this.pagesForms[this.page - 1].controls.password.value) {
              this.message = `Password doesn't match!`;
              break;
            }
            this.message = `Password too weak`;
            break;
          }

          if (this.pagesForms[this.page - 1].controls[name].invalid) {
            if (this.fieldErrors[name]) {
              this.message = this.fieldErrors[name];
            }
            else {
              this.message = `Invalid field '${this.fieldNames[name]}'.`;
            }
            break;
          }
        }
      }

    }
  }

  letsGoBack() {
    this.success = false;
    this.message = '';
    this.page--;
    TweenMax.to('#page' + this.page, 0.4, { alpha: 1, ease: Power4.easeInOut });
  }

  async resend() {
    this.apiService.register2faResend()
      .subscribe((data: HttpResponse<any>) => {
        // verifyForm: FormGroup;
      }, (respError: Error) => {
        try {
          this.message = (respError as any).error.message;

        } catch (error) {
          this.message = (respError as any).message; // or statusText
        }
      });
  }

  exit() {
    if (this.page > 1) {
      const ref = this.alertDialog.open(AlertModalComponent, {
        width: '300px',
        height: '280px',
        disableClose: true,
        data: {
          title: 'Are you sure you want exit onboarding process?',
          message: '',
          links: null,
          actions: [
            { label: 'Yes', color: 'primary' },
            { label: 'No', color: 'primary' }
          ]
        }
      });
      ref.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

}
