import { Component, OnInit, ChangeDetectorRef, forwardRef, Input } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { Router } from '@angular/router';
import { FormTracker } from '../form-tracker';
import { AllowedImagesExt } from '@constants/ui.constant';
import * as uuid from 'uuid';

@Component({
  templateUrl: './company-settings.component.html',
  selector: 'company-settings',
  styleUrls: ['./company-settings.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompanySettingsComponent),
    multi: true
  }]
})
export class CompanySettingsComponent extends Destroyable implements OnInit, ControlValueAccessor {
  @Input() onlyMandatory: boolean;
  @Input() formName: string;
  @Input() submitted: boolean;

  AllowedImagesExt = AllowedImagesExt;
  companyForm: FormGroup;
  loading: boolean;
  companyLogo: any;
  previewSrc: any;
  isUploading = false;
  isDeleting = false;
  isLogoExisted = '';
  logoError: any;
  error: any;

  employeeInsuranceForm: FormGroup;
  publicInsuranceForm: FormGroup;
  cyberInsuranceForm: FormGroup;
  founderForm: FormGroup;
  boardMembersForm: FormGroup;
  documentsForm: FormGroup;
  insuranceForm: FormGroup;
  experienceForm: FormControl;
  onChangeFn: (value) => void;
  onTouched: (value) => void;
  @Input() supplierId;

  docState = Array(4).fill(0).map(t => ({
    error: '',
    isSaving: false,
    isRemoving: false,
    fid: uuid(),
    uploadStatus: ''
  }));

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

  currencyOptions = [
    {
      label: '$',
      value: 'usd'
    },
    {
      label: '£',
      value: 'gbp'
    }
  ];

  selfIdentityOptions = [
    {
      label: 'Minority ethnic',
      value: 'MinorityEthnic'
    },
    {
      label: 'Neurodiverse',
      value: 'NeuroDiverse'
    },
    {
      label: 'LGBT+',
      value: 'LGBT+'
    },
    {
      label: 'Registered disabled',
      value: 'RegisteredDisabled'
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public router: Router,
    private cdRef: ChangeDetectorRef,
    private tracker: FormTracker
  ) {
    super();
  }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      companyNumber: new FormControl('', [Validators.required]),
      incorporated: new FormControl(''),
      companyStage: new FormControl('', [Validators.required]),
      companyWebsite: new FormControl('', [Validators.required]),
      address1: new FormControl('', [Validators.required]),
      address2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      region: new FormControl(''),
      about: new FormControl(''),
      auditing: this.formBuilder.group({
        auditRights: new FormControl(false),
        thirdPartyAuditRights: new FormControl(false)
      }),
      isAward: new FormControl(false),
      details: new FormControl(''),
      currency: new FormControl(''),
      revenue: new FormControl(''),
      competition: new FormControl(''),
      question: new FormControl(''),
      insurance: this.formBuilder.group({
        compensationCurrency: new FormControl(''),
        compensation: new FormControl(''),
        publicLiabilityCurrency: new FormControl(''),
        publicLiability: new FormControl(''),
        dishonestyCurrency: new FormControl(''),
        dishonesty: new FormControl(''),
        indemnityCurrency: new FormControl(''),
        indemnity: new FormControl(''),
        cyberCurrency: new FormControl(''),
        cyber: new FormControl(''),
        details: new FormControl(''),
      }),
      publicInsurance: this.formBuilder.group({
        file: new FormControl(null),
        value: new FormControl(0),
        validDate: new FormControl(),
      }),
      employeeInsurance: this.formBuilder.group({
        file: new FormControl(null),
        value: new FormControl(0),
        validDate: new FormControl(),
      }),
      cyberInsurance: this.formBuilder.group({
        file: new FormControl(null),
        value: new FormControl(0),
        validDate: new FormControl(),
      }),
      logo: new FormControl(undefined),
      experience: new FormControl(undefined),
      founderIdentify: new FormControl([]),
      boardMembersIdentify: new FormControl([]),
      founders: this.formBuilder.group({
        male: new FormControl(undefined),
        female: new FormControl(undefined),
        other: new FormControl(undefined)
      }),
      boardMembers: this.formBuilder.group({
        male: new FormControl(undefined),
        female: new FormControl(undefined),
        other: new FormControl(undefined)
      }),
      documents: this.formBuilder.group({
        file1: new FormControl(undefined),
        name1: new FormControl(undefined),
        key1: new FormControl(undefined),
        file2: new FormControl(undefined),
        name2: new FormControl(undefined),
        key2: new FormControl(undefined),
        file3: new FormControl(undefined),
        name3: new FormControl(undefined),
        key3: new FormControl(undefined),
      }),
      isCarbonNeutral: new FormControl(false),
      isCarbonZero: new FormControl(false),
      haveEsgExpert: new FormControl(false),
      haveEsgCommittee: new FormControl(false),
    });

    this.employeeInsuranceForm = this.companyForm.get('employeeInsurance') as FormGroup;
    this.publicInsuranceForm = this.companyForm.get('publicInsurance') as FormGroup;
    this.cyberInsuranceForm = this.companyForm.get('cyberInsurance') as FormGroup;
    this.experienceForm = this.companyForm.get('experience') as FormControl;
    this.founderForm = this.companyForm.get('founders') as FormGroup;
    this.boardMembersForm = this.companyForm.get('boardMembers') as FormGroup;
    this.documentsForm = this.companyForm.get('documents') as FormGroup;
    this.insuranceForm = this.companyForm.get('insurance') as FormGroup;
    this.companyForm.valueChanges.subscribe((value) => this.onChange(value));

    this.companyForm.get('logo').valueChanges.subscribe(logo => {
      this.isLogoExisted = logo;
      if (this.isLogoExisted) {
        this.previewSrc = '/api/v1/supplier/companylogo';
      }
    });

    this.tracker.tracking(this.formName, 'PersonalSettingsComponent', this.companyForm.valid);
  }

  writeValue(value: any): void {
    this.companyForm.patchValue(value || {});
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(value);
      this.tracker.tracking(this.formName, 'PersonalSettingsComponent', this.companyForm.valid);
    }
  }

  get f(): any {
    return this.companyForm.controls;
  }

  isFieldInvalid(field): boolean {
    return (
      this.f[field].errors && (this.f[field].dirty || this.f[field].touched)
    );
  }

  public onChangeFile(e) {
    this.companyLogo = e.addedFiles[0];
    this.companyForm.get('logo').setValue(this.companyLogo);
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      this.previewSrc = reader.result;
      this.cdRef.detectChanges();
    }, false);

    if (this.companyLogo) {
      reader.readAsDataURL(this.companyLogo);
    }
  }

  isFile(value) {
    return value && (typeof value !== 'string');
  }

  onDownload(index) {
    const pcols = this.documentsForm.value;
    console.log(pcols);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.apiService.getFileUrl(pcols[`key${index}`]);
    a.download = pcols[`key${index}`] || pcols[`file${index}`];
    a.click();
  }

  onSaveDoc(file, index) {
    if (this.docState[index].isRemoving || this.docState[index].isSaving) {
      return;
    }

    this.docState[index].isSaving = true;

    const pcols = this.documentsForm.value;
    this.apiService.saveSupplierDoc({ file, name: pcols[`name${index}`], index, fid: this.docState[index].fid }).subscribe(res => {
      this.docState[index].isSaving = false;
      this.docState[index].isRemoving = false;

      this.docState[index].uploadStatus = '';
      this.docState[index].error = '';
      // this.documentsForm.get(`name${index}`).setValue(undefined);
      this.documentsForm.get(`file${index}`).setValue(res.body.fileName || res.body.file);
      this.documentsForm.get(`key${index}`).setValue(res.body.file || res.body.fileName);

      this.cdRef.detectChanges();
    }, err => {
      this.docState[index].isSaving = false;
      this.docState[index].isRemoving = false;
      this.docState[index].error = err.error.message;
      this.docState[index].uploadStatus = '';
      this.cdRef.detectChanges();
    });
  }

  onRemoveDoc(index) {
    if (this.docState[index].isRemoving || this.docState[index].isSaving) {
      return;
    }
    this.docState[index].isRemoving = true;

    this.apiService.saveSupplierDoc({ file: undefined, index }).subscribe(res => {
      this.docState[index].isRemoving = false;
      this.docState[index].uploadStatus = '';
      this.docState[index].error = '';
      this.documentsForm.get(`file${index}`).setValue(undefined);
      this.documentsForm.get(`name${index}`).setValue(undefined);
      this.cdRef.detectChanges();
    }, err => {
      this.docState[index].isRemoving = false;
      this.docState[index].error = err.error.message;
      this.docState[index].uploadStatus = '';
      this.cdRef.detectChanges();
    });
  }

  onRemoveLogo(event) {
    if (this.isDeleting || this.isUploading) {
      return;
    }

    this.isDeleting = true;
    this.apiService.supplierBrandingLogo(undefined).subscribe((res) => {
      this.isDeleting = false;
      this.logoError = '';
      this.companyLogo = null;
      this.companyForm.get('logo').setValue(undefined);
      this.cdRef.detectChanges();
    }, (err) => {
      this.isDeleting = false;
      this.logoError = err.error.message;
      this.cdRef.detectChanges();
    });
    event.stopPropagation();
  }

  public onUploadLogo(event) {
    if (this.isDeleting || this.isUploading) {
      return;
    }

    this.isUploading = true;
    this.apiService.supplierBrandingLogo(this.companyLogo).subscribe((res) => {
      this.isUploading = false;
      this.logoError = '';
      this.companyLogo = null;
      this.companyForm.get('logo').setValue(res.body.logo);
      this.cdRef.detectChanges();
    }, (err) => {
      this.isUploading = false;
      this.logoError = err.error.message;
      this.cdRef.detectChanges();
    });
    event.stopPropagation();
  }

  onChangeFileField($event: any, fileField: string) {
    this.documentsForm.get(`file${fileField}`).setValue($event);
    if (!this.documentsForm.get(`name${fileField}`).value && this.documentsForm.get(`file${fileField}`).value) {
      this.documentsForm.get(`name${fileField}`).setValue($event.name);
    }
    this.cdRef.detectChanges();
  }
}
