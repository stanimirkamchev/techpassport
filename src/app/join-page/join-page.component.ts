import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VersionProviderService } from '@services/version-provider/version-provider.service';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';

@Component({
  selector: 'join-page',
  templateUrl: './join-page.component.html',
  styleUrls: ['./join-page.component.scss']
})
export class JoinPageComponent implements OnInit {
  public accountForm: FormGroup;
  public MoreDetailsForm: FormGroup;
  public verifyForm: FormGroup;
  public basicDetails = true;
  public moreDetails = false;
  public verifyDetails = false;
  public registerLoading = false;
  public verifyLoading = false;
  public verifyError = '';
  public activeIndex = 0;
  resending = false;
  registerError = '';
  version = VersionProviderService.getVersion();
  public slider: any[] = [
    {
      image: '',
      heading: '',
      paragraph: ``
    },
    {
      image: '',
      heading: '',
      paragraph: ``
    },
    {
      image: '',
      heading: '',
      paragraph: ``
    },
    {
      image: '',
      heading: '',
      paragraph: ``
    }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private docuSignDialog: MatDialog,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+=\-\/\(\/\)\/_])[A-Za-z\d@$!%*?&#+=\-\/\(\/\)\/_]{9,}$/), Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
    this.MoreDetailsForm = this.fb.group({
      companyName: new FormControl('', Validators.required),
      companyNumber: new FormControl('', Validators.required),
      companyRole: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      termsAndConditions: new FormControl(null, Validators.required)
    });
    this.verifyForm = this.fb.group({
      verifyOne: new FormControl('', Validators.required),
      verifyTwo: new FormControl('', Validators.required),
      verifyThree: new FormControl('', Validators.required),
      verifyFour: new FormControl('', Validators.required),
      verifyFive: new FormControl('', Validators.required),
      verifySix: new FormControl('', Validators.required)
    });
  }

  goToMoreDetails() {
    this.basicDetails = false;
    this.moreDetails = true;
  }

  goToBasicDetails() {
    this.moreDetails = false;
    this.basicDetails = true;
  }

  goToVerifyDetails() {
    this.registerLoading = true;
    this.apiService.register({
      ...this.accountForm.value,
      firstName: this.accountForm.value.name,
      ...this.MoreDetailsForm.value,
    }).subscribe({
      next: () => {
        this.moreDetails = false;
        this.verifyDetails = true;
        this.registerLoading = false;
      },
      error: ({ error }) => {
        this.toastr.error(error.message);
        this.registerError = error.message;
        setTimeout(() => {
          this.registerError = '';
        }, 4000);
        this.registerLoading = false;
      },
    });

  }

  resendOTP() {
    this.resending = true;
    this.apiService.register2faResend().subscribe({
      next: () => {
        this.toastr.success('We have resend confirmation code to your email.');
        setTimeout(() => {
          this.resending = false;
        }, 1000);
      },
      error: ({ error }) => {
        this.toastr.error(error.message);
        setTimeout(() => {
          this.resending = false;
        }, 1000);
      },
    });
  }

  submitForm(code) {
    this.verifyLoading = true;
    this.apiService.register2fa(code).subscribe({
      next: () => {
        this.eventEmitterService.onLoggedin();
        // this.router.navigateByUrl('/portal');
        this.verifyLoading = false;
      },
      error: ({ error }) => {
        this.verifyError = error.message;
        this.verifyLoading = false;
        setTimeout(() => {
          this.verifyError = '';
        }, 4000);
      },
    });
  }

  nextSlide() {
    if (this.activeIndex === this.slider.length - 1) { return; }
    this.activeIndex = this.activeIndex + 1;
  }

  previousSlide() {
    if (this.activeIndex === 0) { return; }
    this.activeIndex = this.activeIndex - 1;
  }

  closeJoinMenu() {
    this.basicDetails = false;
    this.moreDetails = false;
    this.router.navigateByUrl('/home');
  }

  onTermsResult(val: boolean) {
    if (val) {
      this.MoreDetailsForm.get('termsAndConditions').setValue(true);
    }
  }
}
