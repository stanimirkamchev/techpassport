import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FileHandle } from '@directives/dragDrop.directive';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { ContractModalComponent } from '../../../portal/contract-modal/contract-modal.component';
import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { getData } from 'country-list';
import { SupplierMembershipComponent } from 'src/app/supplier-membership/supplier-membership.component';

// declare const Stripe: any;


interface TeamMember {
  name: string;
  email: string;
  role: string;
  pocNotices: string; // string
}

@Component({
  selector: 'app-supplier-onboarding-modal',
  templateUrl: './supplier-onboarding-modal.component.html',
  styleUrls: ['./supplier-onboarding-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// @Input()
// disableRipple: boolean

export class SupplierOnboardingModalComponent implements OnInit {
  @ViewChild(MatStepper) stepper: MatStepper;
  @ViewChild(SupplierMembershipComponent) membershipView: SupplierMembershipComponent;
  allCoutries = getData();
  viewReady = false;
  dateClass = '';
  isLinear = true;
  requestInProgress = true;
  onboarding = true;
  stepValidated = true;
  companyFormGroup: FormGroup;
  insuranceFormGroup: FormGroup;
  teamFormGroup: FormGroup;
  auditingRightsFormGroup: FormGroup;
  previousAgreementFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  message = '';
  weCharge = false;
  previousAgreementEnabled = {
    banking: false,
    insurance: false,
    wealthManagement: false,
    lifeAssurancePensions: false,
    regulatory: false,
    assetManagement: false
  };

  // TODO:OZGUR Move FUNDING OPTIONS to a service and centralize the usage.
  fundingOptions = [
    {
      label: 'Angel',
      value: 'Angel',
    },
    {
      label: 'Business Plan Competition',
      value: 'Business Plan Competition',
    },
    {
      label: 'Bridge',
      value: 'Bridge',
    },
    {
      label: 'Convertible Note',
      value: 'Convertible Note',
    },
    {
      label: 'Corporate Minority',
      value: 'Corporate Minority',
    },
    {
      label: 'Crowdfunding',
      value: 'Crowdfunding',
    },
    {
      label: 'Debt',
      value: 'Debt',
    },
    {
      label: 'Grant',
      value: 'Grant',
    },
    {
      label: 'Growth Equity',
      value: 'Growth Equity',
    },
    {
      label: 'Incubator',
      value: 'Incubator',
    },
    {
      label: 'Line of Credit',
      value: 'Line of Credit',
    },
    {
      label: 'Loan',
      value: 'Loan',
    },
    {
      label: 'Mezzanine',
      value: 'Mezzanine',
    },
    {
      label: 'Pre-Seed',
      value: 'Pre-Seed',
    },
    {
      label: 'Private Equity',
      value: 'Private Equity',
    },
    {
      label: 'Seed',
      value: 'Seed',
    },
    {
      label: 'Seed VC',
      value: 'Seed VC',
    },
    {
      label: 'Series A',
      value: 'Series A',
    },
    {
      label: 'Series B',
      value: 'Series B',
    },
    {
      label: 'Series C',
      value: 'Series C',
    },
    {
      label: 'Series D',
      value: 'Series D',
    },
    {
      label: 'Series E',
      value: 'Series E',
    },
    {
      label: 'Series F',
      value: 'Series F',
    },
    {
      label: 'Series G',
      value: 'Series G',
    },
    {
      label: 'Series H',
      value: 'Series H',
    },
    {
      label: 'Undisclosed',
      value: 'Undisclosed',
    },
    {
      label: 'Venture Capital',
      value: 'Venture Capital',
    },
    {
      label: 'Bootstrapped',
      value: 'Bootstrapped',
    }];

  opt = {
    info: 'To get the best out of our platform, we recommend that you use our POC Tool. It won’t cost you anymore money to use it but will help to improve your bank engagement experience. \n Our POC template is based on industry best practise and is fair for the supplier and customer, allowing both parties to negotiate the specific elements of the trial on the platform. \n Using our super smart collaboration and negation tool, we will get you to the right people in the business with ease and accelerate your journey to success! \n But we understand that you might want to run this contract by your legal team so we give you the option to opt into this later.'
  };

  insuranceEmployee = {
    files: [],
    validDate: null,
    value: null,
    upload: false,
  };
  insurancePublic = {
    files: [],
    validDate: null,
    value: null,
    upload: false,
  };
  insuranceCyber = {
    files: [],
    validDate: null,
    value: null,
    upload: false,
  };
  branding = {
    files: [],
    about: '' //
  };
  team = {
    members: [],
    pocNotices: 'yes'
  };

  fieldNames = {
    name: 'Company full name',
    country: 'Country of company',
    incorporated: 'Date company incorporated',
    companyNumber: 'Company registration number',
    companyWebsite: 'Company Website',
    companyStage: 'Stage of company',
    address1: 'Address 1st Line',
    address2: 'Address Line 2',
    city: 'City',
    postcode: 'Postcode',
    region: 'Region',
  };

  fieldErrors = {
    companyNumber: `Invalid Company '${this.fieldNames.companyNumber}'. Usually tt is 8 numbers, or 2 letters followed by 6 numbers.`,
  };

  constructor(
    private dialogRef: MatDialogRef<SupplierOnboardingModalComponent>,
    private fb: FormBuilder,
    private alertDialog: MatDialog,
    private contractDialog: MatDialog,
    private apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private stripeFactory: StripeFactoryService
    // private stripeService: StripeService
  ) {

    this.companyFormGroup = fb.group({
      name: new FormControl('', Validators.minLength(2)),
      country: new FormControl('gb', Validators.minLength(2)),
      incorporated: new FormControl(''), // , Validators.minLength(8)
      companyNumber: new FormControl('', Validators.minLength(2)),
      companyStage: new FormControl(''), // , Validators.minLength(2)
      companyWebsite: new FormControl('', Validators.minLength(5)),
      address1: new FormControl('', Validators.minLength(2)),
      address2: new FormControl('', Validators.minLength(2)),
      city: new FormControl('', Validators.minLength(2)),
      postcode: new FormControl('', Validators.minLength(2))
    });
    this.insuranceFormGroup = fb.group({
      doYou: new FormControl(null),
      understood: new FormControl(false)
    });
    this.teamFormGroup = fb.group({
      email: new FormControl('', Validators.email),
      name: new FormControl('', Validators.minLength(2)),
      role: new FormControl('member', Validators.minLength(2)),
      pocNotices: new FormControl('')
    });
    this.auditingRightsFormGroup = fb.group({
      auditRights: new FormControl('', [Validators.minLength(2), Validators.required]),
      thirdPartyAuditRights: new FormControl('', [Validators.minLength(2), Validators.required])
    });

    this.previousAgreementFormGroup = fb.group({
      banking: new FormControl('', [Validators.minLength(2), Validators.required]),
      insurance: new FormControl('', [Validators.minLength(2), Validators.required]),
      wealthManagement: new FormControl('', [Validators.minLength(2), Validators.required]),
      lifeAssurancePensions: new FormControl('', [Validators.minLength(2), Validators.required]),
      regulatory: new FormControl('', [Validators.minLength(2), Validators.required]),
      assetManagement: new FormControl('', [Validators.minLength(2), Validators.required])
    });
  }

  ngOnInit() {
    this.initSupplierData();
  }
  /* ngAfterViewInit() {
     this.qList.changes.subscribe((comps: QueryList<MatStepper>) => {
       console.log('changes');
       this.stepper = comps.first;
       if (!isNaN(this.data.step))
         this.stepper.selectedIndex = this.data.step;
       this.initSupplierData();

     });

   }*/
  initSupplierData() {
    this.apiService.getSupplierDetails()
      .subscribe((data: HttpResponse<Object>) => {

        this.companyFormGroup.patchValue(data.body);
        if ((data.body as any).logo) {
          this.branding.files.push({ url: '/api/v1/supplier/companylogo' });
        }

        this.branding.about = (data.body as any).about;
        if ((data.body as any).insurance === true || (data.body as any).insurance === false) {
          this.insuranceFormGroup.patchValue({ doYou: (data.body as any).insurance === true ? 'yes' : 'no' });
        }

        if ((data.body as any).auditing) {
          this.auditingRightsFormGroup.patchValue({
            auditRights: (data.body as any).auditing.auditRights,
            thirdPartyAuditRights: (data.body as any).auditing.thirdPartyAuditRights
          });
        }

        if ((data.body as any).experience) {
          this.previousAgreementFormGroup.patchValue({
            banking: (data.body as any).experience.banking,
            insurance: (data.body as any).experience.insurance,
            wealthManagement: (data.body as any).experience.wealthManagement,
            lifeAssurancePensions: (data.body as any).experience.lifeAssurancePensions,
            regulatory: (data.body as any).experience.regulatory,
            assetManagement: (data.body as any).experience.assetManagement
          });
          this.previousAgreementEnabled = {
            banking: this.previousAgreementFormGroup.value.banking?.length > 0,
            insurance: this.previousAgreementFormGroup.value.insurance?.length > 0,
            wealthManagement: this.previousAgreementFormGroup.value.wealthManagement?.length > 0,
            lifeAssurancePensions: this.previousAgreementFormGroup.value.lifeAssurancePensions?.length > 0,
            regulatory: this.previousAgreementFormGroup.value.regulatory?.length > 0,
            assetManagement: this.previousAgreementFormGroup.value.assetManagement?.length > 0
          };
        }

        try {
          for (let i = 0; i < (data.body as any).insuranceCert.length; i++) {
            const certType = (data.body as any).insuranceCert[i].certType;
            this[`insurance${certType}`] = (data.body as any).insuranceCert[i];
            if (this[`insurance${certType}`].file) {
              this[`insurance${certType}`].files = [this[`insurance${certType}`].file];
            }
            else {
              this[`insurance${certType}`].files = [];
            }
          }
        } catch (error) {
          console.log(error);
        }
        setTimeout(() => { /// << TO DO
          if (!isNaN(this.data.step)) {
            this.stepper.selectedIndex = this.data.step;
          }
          this.membershipView.currectMembersip((data.body as any).membership);
        }, 1000);

        this.requestInProgress = false;
        this.viewReady = true;

      }, (respError: Error) => {
        this.requestInProgress = false;
        this.viewReady = true;
      });
  }

  /*ngOnInit() {
  }
  downloadAsPDF(membershipTryOption) {
    let url = this.apiService.getTermsURL(membershipTryOption, this.paymentFormGroup.value.how);
    window.open(url);
  }*/



  stepChanged(event) {
    switch (event.selectedIndex) {
      case 1:
        this.stepValidated = this.membershipView.isValid();
        break;
      case 2:
        this.message = '';
        break;
      case 3:
        this.stepValidated = this.insuranceFormGroup.value.doYou === 'yes' || this.insuranceFormGroup.value.understood === true;
        break;
      case 4:
        break;
      default:
        this.stepValidated = true;
    }
  }
  goForwardDisabled() {
    try {
      switch (this.stepper.selectedIndex) {
        case 1:
          return !this.membershipView.isValid();
        case 3:
          return !(this.insuranceFormGroup.value.doYou === 'yes' || this.insuranceFormGroup.value.understood === true);
        default:
          return this.requestInProgress === true || this.stepValidated === false;
      }
    } catch (error) {

    }

    return true;
  }
  goBack(stepper: MatStepper) {
    this.requestInProgress = false;
    this.stepValidated = true;
    stepper.previous();
  }

  async goForward(stepper: MatStepper) {
    switch (stepper.selectedIndex) {
      case 0: {

        if (this.companyFormGroup.invalid === true) {
          for (const name in this.companyFormGroup.controls) {
            if (this.companyFormGroup.controls[name].invalid) {
              if (this.fieldErrors[name]) {
                this.message = this.fieldErrors[name];
              }
              else {
                this.message = `Invalid field '${this.fieldNames[name]}'.`;
              }
              break;
            }
          }
          break;
        }
        this.requestInProgress = true;
        this.apiService.supplierDetails(this.companyFormGroup.value).subscribe(
          (data: HttpResponse<Object>) => {
            this.message = '';
            this.companyFormGroup.patchValue(data.body);
            stepper.next();
            this.requestInProgress = false;
          },
          (respError: Error) => {
            try {
              this.message = (respError as any).error.message;
            } catch (error) {
              this.message = respError.message; // or statusText
            }
            this.requestInProgress = false;
          }
        );
        break;
      }
      case 1: {
        const agreement = this.membershipView.getAgreement();
        if (agreement && agreement.clickwrapId) {
          this.requestInProgress = true;
          this.apiService.confirmTermsAndCongitions(agreement.clickwrapId, agreement.clientUserId).subscribe((data: HttpResponse<Object>) => {
            stepper.next();
            this.requestInProgress = false;
          }, (respError: Error) => {
            try {
              this.message = (respError as any).error.message;
            } catch (error) {
              this.message = respError.message; // or statusText
            }
            this.requestInProgress = false;
          });
        } else {
          stepper.next();
        }
        break;
      }
      case 2: {
        let logo;
        const about = this.branding.about;
        if (this.branding.files.length > 0) {
          logo = this.branding.files[0].file;
        }


        let respCounter = 0;
        let respSuccessCounter = 0;
        let respLength = 0;
        this.requestInProgress = true;
        this.stepValidated = true;
        this.message = 'Scanning file..';
        if (about && about.length > 0) {// or different then was
          respLength++;
          this.apiService.supplierBranding({ about }).subscribe(
            (data: HttpResponse<Object>) => {
              respCounter++;
              respSuccessCounter++;
              if (respCounter < respLength) {
                return;
              }
              this.message = '';
              stepper.next();
              this.requestInProgress = false;
            },
            (respError: Error) => {
              respCounter++;
              try {
                this.message = (respError as any).error.message;
              } catch (error) {
                this.message = respError.message; // or statusText
              }
              if (respCounter === respLength) {
                this.requestInProgress = false;
              }

              // this.stepValidated = false;
            }
          );
        }
        if (typeof logo !== 'undefined') {
          respLength++;
          this.apiService.supplierBrandingLogo(logo).subscribe(
            (data: HttpResponse<Object>) => {
              respCounter++;
              respSuccessCounter++;
              if (respCounter < respLength) {
                return;
              }
              this.message = '';
              stepper.next();
              this.requestInProgress = false;
            },
            (respError: Error) => {
              respCounter++;
              try {
                this.message = (respError as any).error.message;
              } catch (error) {
                this.message = respError.message; // or statusText
              }
              if (respCounter === respLength) {
                this.requestInProgress = false;
              }

              //  this.stepValidated = false;
            }
          );
        }
        if (respLength === 0) {
          stepper.next();
          this.requestInProgress = false;
        }
        break;
      }
      case 3: {
        // Insurance
        this.message = '';
        this.requestInProgress = true;
        this.apiService.supplierInsurance({ insurance: this.insuranceFormGroup.value.doYou === 'yes' }).subscribe(
          async (data: HttpResponse<Object>) => {
            const total = 0;
            this.apiService.supplierInsuranceCert(
              null,
              'Employee',
              this.insuranceEmployee.validDate,
              this.insuranceEmployee.value
            )
              .subscribe((data: HttpResponse<Object>) => {

              }, (respError: Error) => {
                try {
                  this.message = (respError as any).error.message;
                } catch (error) {
                  this.message = respError.message; // or statusText
                }
                this.requestInProgress = false;
              });



            // this.requestInProgress = true;

            this.apiService.supplierInsuranceCert(
              null,
              'Public',
              this.insurancePublic.validDate,
              this.insurancePublic.value
            )
              .subscribe((data: HttpResponse<Object>) => {

              }, (respError: Error) => {
                try {
                  this.message = (respError as any).error.message;
                } catch (error) {
                  this.message = respError.message; // or statusText
                }
                this.requestInProgress = false;
              });



            // this.requestInProgress = true

            this.apiService.supplierInsuranceCert(
              null,
              'Cyber',
              this.insuranceCyber.validDate,
              this.insuranceCyber.value
            )
              .subscribe((data: HttpResponse<Object>) => {

              }, (respError: Error) => {
                console.log('respError', respError);
                try {
                  this.message = (respError as any).error.message;
                } catch (error) {
                  this.message = respError.message; // or statusText
                }
                this.requestInProgress = false;
              });
            //////
            if (total === 0) {
              this.message = '';
              stepper.next();
              this.requestInProgress = false;
            }
          },
          (respError: Error) => {
            try {
              this.message = (respError as any).error.message;
            } catch (error) {
              this.message = respError.message; // or statusText
            }
            this.requestInProgress = false;
          }
        );
        break;
      }
      case 4: {
        if (!this.auditingRightsFormGroup.valid) {
          stepper.next();
          return;
        }
        this.requestInProgress = true;
        this.apiService.supplierOther({ auditing: this.auditingRightsFormGroup.value, experience: this.previousAgreementFormGroup.value }).subscribe(
          (data: HttpResponse<Object>) => {
            this.message = '';
            this.requestInProgress = false;
            stepper.next();
          },
          (respError: Error) => {
            try {
              this.message = (respError as any).error.message;
            } catch (error) {
              this.message = respError.message; // or statusText
            }
            this.requestInProgress = false;
          }
        );
        break;
      }
      case 5: {
        // TEAM
        this.requestInProgress = true;
        if (this.teamFormGroup.valid) {
          this.addMember();
        }

        this.apiService.addTeamMembers(this.team.members).subscribe(
          (data: HttpResponse<Object>) => {
            this.message = '';
            this.onboarding = false;
            this.requestInProgress = false;
          },
          (respError: Error) => {
            console.log('respError', respError);
            try {
              this.message = (respError as any).error.message;
            } catch (error) {
              this.message = respError.message; // or statusText
            }
            this.requestInProgress = false;
          }
        );
        break;
      }
    }
  }
  //  stepper.next();

  print() {
    const frm = (document.getElementById('termsFrame') as any).contentWindow;
    frm.focus(); // focus on contentWindow is needed on some ie versions
    frm.print();
  }

  async filesDropped(where, files: FileHandle[]) {
    this[where].files = files;
    this[where].upload = true;

    if (where === 'insuranceEmployee' && this.insuranceEmployee.files.length > 0 && this.insuranceEmployee.upload === true) {
      //  this.requestInProgress = true;
      this.message = 'Scanning file...';
      this.apiService.supplierInsuranceCert(
        this.insuranceEmployee.files[0].file,
        'Employee',
        this.insuranceEmployee.validDate,
        this.insuranceEmployee.value
      )
        .subscribe((data: HttpResponse<Object>) => {
          this.requestInProgress = false;
          this.message = '';
        }, (respError: Error) => {
          try {
            this.message = (respError as any).error.message;
          } catch (error) {
            this.message = respError.message; // or statusText
          }
          this.requestInProgress = false;
        });
    }

    if (where === 'insurancePublic' && this.insurancePublic.files.length > 0 && this.insurancePublic.upload === true) {
      // this.requestInProgress = true;
      this.message = 'Scanning file...';
      this.apiService.supplierInsuranceCert(
        this.insurancePublic.files[0].file,
        'Public',
        this.insurancePublic.validDate,
        this.insurancePublic.value
      )
        .subscribe((data: HttpResponse<Object>) => {

          this.message = '';
          this.requestInProgress = false;
        }, (respError: Error) => {
          try {
            this.message = (respError as any).error.message;
          } catch (error) {
            this.message = respError.message; // or statusText
          }
          this.requestInProgress = false;
        });
    }

    if (where === 'insuranceCyber' && this.insuranceCyber.files.length > 0 && this.insuranceCyber.upload === true) {
      // this.requestInProgress = true
      this.message = 'Scanning file...';
      this.apiService.supplierInsuranceCert(
        this.insuranceCyber.files[0].file,
        'Cyber',
        this.insuranceCyber.validDate,
        this.insuranceCyber.value
      )
        .subscribe((data: HttpResponse<Object>) => {
          this.message = '';
          /*if (total === 0){
            this.message = "";
            stepper.next();
            this.requestInProgress = false
          }*/
          this.requestInProgress = false;

        }, (respError: Error) => {
          console.log('respError', respError);
          try {
            this.message = (respError as any).error.message;
          } catch (error) {
            this.message = respError.message; // or statusText
          }
          this.requestInProgress = false;
        });
    }


  }

  async removeFile(where, i) {

    let key = '';
    switch (where) {
      case 'insuranceEmployee':
        key = 'Employee';
        break;
      case 'insurancePublic':
        key = 'Public';
        break;
      case 'insuranceCyber':
        key = 'Cyber';
        break;
    }
    this.apiService.supplierInsuranceRem(key).subscribe((data: HttpResponse<Object>) => {
      const removedFile = this[where].files.splice(i, 1);
      this[where].upload = false;
    }, (respError: Error) => {
      try {
        this.message = (respError as any).error.message;
      } catch (error) {
        this.message = respError.message; // or statusText
      }
      this.requestInProgress = false;
    });
  }

  noInsurance() {
    if (this.insuranceFormGroup.value.doYou === 'yes' || this.insuranceFormGroup.value.understood === true) {
      this.stepValidated = true;
      return;
    }

    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '360px',
      height: '280px',
      disableClose: true,
      data: {
        title: '',
        message: 'To complete onboarding you\'ll need to have your business insured. Here is an insurance option you might be interested in.',
        actions: [{ label: 'Understood', color: 'accent' }],
        links: [{ url: 'https://www.digitalrisks.co.uk/partners/techpassport/', label: 'Digital Risks Business Insurance' }]
      }
    });
    ref.afterClosed().subscribe(result => {
      this.insuranceFormGroup.patchValue({ understood: true });
      this.stepValidated = true;
    });
  }
  addMember() {
    const tm: TeamMember = {
      name: this.teamFormGroup.value.name,
      email: this.teamFormGroup.value.email,
      role: this.teamFormGroup.value.role,
      pocNotices: this.teamFormGroup.value.pocNotices
    };
    this.team.members.splice(0, 0, tm);
    this.teamFormGroup.reset({ role: 'member' });
  }

  removeMember(index: number) {
    this.team.members.splice(index, 1);
  }

  readContract() {
    this.contractDialog.open(ContractModalComponent, {
      width: '69vw',
      height: '78vh',
      maxWidth: undefined,
      disableClose: false
    });
  }
  exitAndOnboard() {
    return this.fin(true);
  }

  exit() {
    if (this.onboarding === false) {
      return this.fin(false);
    }
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '300px',
      height: '280px',
      disableClose: true,
      data: { title: 'Are you sure you want exit onboarding process?', message: '', links: null, actions: [{ label: 'Yes', color: 'primary' }, { label: 'No', color: 'primary' }] }
    });
    ref.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.dialogRef.close();
      }
    });
  }
  async fin(doProduct?: boolean) {
    this.dialogRef.close();
    this.apiService.supplierStatus().subscribe(
      (data: HttpResponse<Object>) => {
        this.eventEmitterService.onOnboadDone((data.body as any).status, (data.body as any).hasProduct, false);
        if (doProduct === true) {
          this.router.navigateByUrl('/portal');
          this.eventEmitterService.onProductOnboad(null);
        } else {
          this.router.navigateByUrl('/portal');
        }
      },
      (respError: Error) => {

      }
    );
  }

  checkboxChange(event, f) {
    this.previousAgreementEnabled[f] = event.checked;
  }
}
