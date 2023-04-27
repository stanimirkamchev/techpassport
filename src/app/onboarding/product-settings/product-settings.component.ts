import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Destroyable } from '@abstract/destroyable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from '@services/api/api.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { AddSolutionModalComponent } from './add-solution-modal/add-solution-modal.component';
import { FormTracker } from '../form-tracker';
import { AddTagModalComponent } from './add-tag-modal/add-tag-modal.component';
import * as uuid from 'uuid';

@Component({
  templateUrl: './product-settings.component.html',
  selector: 'product-settings',
  styleUrls: ['./product-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSettingsComponent extends Destroyable implements OnInit {
  options = [
    {
      label: 'Banking',
      value: 'banking'
    },
    {
      label: 'Insurance',
      value: 'insurance'
    },
    {
      label: 'Wealth Management',
      value: 'wealth_management'
    },
    {
      label: 'Life assurance and pensions',
      value: 'life_assurance'
    },
    {
      label: 'Regulatory',
      value: 'regulatory'
    },
    {
      label: 'Regulatory',
      value: 'regulatory1'
    },
    {
      label: 'Asset Management',
      value: 'asset_management'
    },
  ];

  files: File[] = [];
  productForm: FormGroup;
  submitted = false;
  loading = false;
  draftSaving = false;
  supplier: any;
  productId: any;
  productDetails: any;
  isRemoving = false;
  addOnBlur = true;
  vidUrl: string;
  onlyMandatory = false;
  updatedAt: Date;
  videoState = {
    error: '',
    isSaving: false,
    isRemoving: false,
    fid: uuid(),
    uploadStatus: ''
  };

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  taxonomyOptions = [
    {
      label: 'Digital lending',
      value: 'Digital lending',
      selectable: false,
      children: [
        {
          label: 'Digital credit solutions',
          value: 'Digital credit solutions',
          children: [
            {
              label: 'Customer purchase financing',
              value: 'Customer purchase financing'
            },
            {
              label: 'Cash advance solutions',
              value: 'Cash advance solutions'
            },
            {
              label: 'Buy now pay later',
              value: 'Buy now pay later'
            }
          ]
        },
        {
          label: 'Balance sheet lending',
          value: 'Balance sheet lending',
          children: [
            {
              label: 'Balance sheet business lending',
              value: 'Balance sheet business lending'
            },
            {
              label: 'Balance sheet property lending',
              value: 'Balance sheet property lending'
            },
            {
              label: 'Balance sheet consumer lending',
              value: 'Balance sheet consumer lending'
            }
          ]
        },
        {
          label: 'Lending analytics',
          value: 'Lending analytics',
          children: [
            {
              label: 'Credit scoring',
              value: 'Credit scoring'
            },
            {
              label: 'Psychometric analytics',
              value: 'Psychometric analytics'
            },
            {
              label: 'Sociometric analytics',
              value: 'Sociometric analytics'
            },
            {
              label: 'Biometric analytics',
              value: 'Biometric analytics'
            }
          ]
        },
        {
          label: 'Misc. lending solutions',
          value: 'Misc. lending solutions',
          children: [
            {
              label: 'Origination and packaging',
              value: 'Origination and packaging'
            },
            {
              label: 'Crowd-led microfinance',
              value: 'Crowd-led microfinance'
            },
            {
              label: 'Invoice trading',
              value: 'Invoice trading'
            },
            {
              label: 'Debt-base securities',
              value: 'Debt-base securities'
            },
            {
              label: 'P2P microfinancing',
              value: 'P2P microfinancing'
            }
          ]
        }
      ]
    },
    {
      label: 'Enterprise technology',
      value: 'Enterprise technology',
      children: [
        {
          label: 'Business accounting',
          value: 'Business accounting',
          children: [
            {
              label: 'Purchasing',
              value: 'Purchasing'
            },
            {
              label: 'Spend management',
              value: 'Spend management'
            },
          ]
        },
        // {
        //   label: "Third party supplier engagement",
        //   value: "Third party supplier engagement"
        // },
        // {
        //   label: "Workplace management",
        //   value: "Workplace management"
        // }
      ]
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public router: Router,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private tracker: FormTracker
  ) {
    super();
  }

  ngOnInit() {
    this.productId = this.route.snapshot.queryParams.productId;

    this.productForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      category: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      rapidPOC: new FormControl(false),
      isTraining: new FormControl(false),
      onboardingTime: new FormControl(0),
      tags: new FormControl([]),
      type: new FormControl([], [Validators.required]),
      licensing: new FormControl(undefined),
      productVideo: new FormControl(undefined),
      productCollateral: new FormControl(undefined),
      productHosting: new FormControl(undefined),
      dataAccess: new FormControl(undefined),
      charges: new FormControl(undefined),
      specialConditions: new FormControl(undefined),
      integratedSolutions: new FormControl([]),

    });

    this.getSupplierDetails();
    this.getTaxonomies();
    if (this.productId) {
      this.onEditProduct();
      this.productForm.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
        if (this.productForm.valid && this.tracker.isValid('productSettings')) {
          const resValue = this.transformProductForSubmit(this.productForm.value);
          // console.log('value', resValue);
          // this.apiService.updateProduct(this.productId, {
          //   details: {
          //     ...value,
          //   }
          // }, false, false).subscribe();
        }
      });
    }
  }

  onNewSolution(event) {
    this.dialog.open(AddSolutionModalComponent, {
      height: '400px',
      width: '600px',
      panelClass: 'custom-container'
    }).afterClosed().subscribe(result => {
      if (result) {
        // this.isAddingSolution = true
        this.apiService.addSolution(result.name, result.type).subscribe(res => {
          // this.isAddingSolution = false
          this.productForm.get('integratedSolutions').setValue([...this.productForm.get('integratedSolutions').value ?? [], result.name]);
          this.cdRef.detectChanges();
        });
      }
    });
  }

  onNewTag(event) {
    this.dialog.open(AddTagModalComponent, {
      height: '250px',
      width: '600px',
      panelClass: 'custom-container'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.apiService.addTag(result.name).subscribe(res => {
          this.productForm.get('tags').setValue([...this.productForm.get('tags').value ?? [], result.name]);
          this.cdRef.detectChanges();
        });
      }
    });
  }

  getSupplierDetails() {
    this.apiService.getSupplierDetails().subscribe(res => {
      if (res.body) {
        this.supplier = res.body;
      }
    });
  }

  calculateTaxonomyItems(data: any[]) {
    return data.map((item) => {
      return {
        label: item.title,
        value: item.value,
        children: item?.items?.length ? this.calculateTaxonomyItems(item.items) : []
      };
    });
  }

  getTaxonomies() {
    this.apiService.getSupplierTaxonomyTags().subscribe((res) => {
      this.taxonomyOptions = res.body?.length ? this.calculateTaxonomyItems(res.body) : [];
    });
  }

  onSaveVideo(file) {
    if (this.videoState.isRemoving || this.videoState.isSaving) {
      return;
    }
    let videoValue = this.productForm.get('productVideo').value;
    this.videoState.isSaving = true;
    if (file) {
      this.apiService.uploadProductVideo(this.productId, file, videoValue?.videoName, videoValue?.videoDescription, this.supplier.id, this.videoState.fid)
        .subscribe(res => {
          this.videoState.isSaving = false;
          this.videoState.error = '';
          this.videoState.uploadStatus = '';
          videoValue = this.productForm.get('productVideo').value;
          this.productForm.get('productVideo').setValue({
            videoName: videoValue?.videoName,
            videoDescription: videoValue?.videoDescription,
            file: res.body.media
          });
          if (!this.productId) {
            this.productId = res.body.product;
          }
          this.cdRef.detectChanges();
        }, err => {
          this.videoState.isSaving = false;
          this.videoState.error = err.error.message;
          this.cdRef.detectChanges();
        });
    }
  }

  onRemoveVideo() {
    if (this.videoState.isRemoving || this.videoState.isSaving) {
      return;
    }
    let videoValue = this.productForm.get('productVideo').value;
    this.videoState.isRemoving = true;
    this.apiService.removeProductVideo(this.productId).subscribe(res => {
      this.videoState.isRemoving = false;
      this.videoState.error = '';
      this.videoState.uploadStatus = '';
      videoValue = this.productForm.get('productVideo').value;
      this.productForm.get('productVideo').setValue({
        videoName: videoValue?.videoName,
        videoDescription: videoValue?.videoDescription,
        file: null
      });
      this.cdRef.detectChanges();
    }, err => {
      this.videoState.isRemoving = false;
      this.videoState.error = err.error.message;
      this.cdRef.detectChanges();
    });
  }

  onEditProduct() {
    this.vidUrl = `/api/v1/product/${this.productId}/video/stream`;
    this.apiService.getProductVideo(this.productId)
      .subscribe(res => {
        this.productForm.get('productVideo').setValue({
          ...this.productForm.get('productVideo').value,
          file: res.body?.media
        });
      });
    this.apiService.getProductDetails(this.productId).subscribe(res => {
      if (res.body) {
        this.productForm.get('tags').setValue(res.body.tags?.tags || []);
        this.productDetails = this.transformOldData(res.body.details) || {};
        this.updatedAt = res.body.details?.updatedAt;
        this.productForm.get('name').setValue(this.productDetails.details.name);
        this.productForm.get('category').setValue(this.productDetails.details.category);
        this.productForm.get('description').setValue(this.productDetails.details.functionality || this.productDetails.details.description);
        this.productForm.get('isTraining').setValue(this.productDetails.details.isTraining || false);
        this.productForm.get('onboardingTime').setValue(this.productDetails.details.onboardingTime);
        this.productForm.get('rapidPOC').setValue(
          this.productDetails.details.rapidPOC === true
          || this.productDetails.details.rapidPOC === 'yes'
          || this.productDetails.details.rapidPOC === 'true'
        );
        this.productForm.get('licensing').setValue(this.productDetails.details.applicationSoftware
          || this.transformLicensingData(this.productDetails.licensing));
        this.productForm.get('productHosting').setValue(this.productDetails.details.productHosting
          || this.transformAccessData(this.productDetails.access));
        this.productForm.get('dataAccess').setValue(this.productDetails.details.dataAccess
          || this.transformAccessData(this.productDetails.access));
        this.productForm.get('specialConditions').setValue(this.productDetails.details.useCases
          || this.transformSpecialConditionsData(this.productDetails.specialConditions));

        this.productForm.get('charges').setValue(this.transformChargesData(this.productDetails.details.charges || this.productDetails.charges));
        this.productForm.get('type').setValue(this.productDetails.details.taxonomy || this.productDetails.details.type);
        this.productForm.get('integratedSolutions').setValue(this.productDetails.details.integratedSolutions);
        this.productForm.get('productVideo').setValue({
          ...this.productForm.get('productVideo').value,
          videoName: this.productDetails.details.productVideo?.videoName,
          videoDescription: this.productDetails.details.productVideo?.videoDescription,
        });
        const collaterals = res.body.productCollateral;
        this.productForm.get('productCollateral').setValue({
          file1: collaterals.find(t => t.index === 1)?.fileName || collaterals.find(t => t.index === 1)?.file,
          name1: this.productDetails.productCollateral?.name1,
          key1: collaterals.find(t => t.index === 1)?.file,
          file2: collaterals.find(t => t.index === 2)?.fileName || collaterals.find(t => t.index === 2)?.file,
          name2: this.productDetails.productCollateral?.name2,
          key2: collaterals.find(t => t.index === 2)?.file,
          file3: collaterals.find(t => t.index === 3)?.fileName || collaterals.find(t => t.index === 3)?.file,
          name3: this.productDetails.productCollateral?.name3,
          key3: collaterals.find(t => t.index === 3)?.file,
        });
      }
    });
  }

  public onSubmit(isDraft = false) {
    const value = this.transformProductForSubmit(this.productForm.getRawValue());
    this.submitted = true;
    let isValidForm = this.isFormValid();

    if (isDraft) {
      this.draftSaving = true;
      isValidForm = true;
    } else {
      this.loading = true;
    }

    if (isValidForm) {
      if (this.productId) {
        this.apiService.updateProduct(
          this.productId,
          { ...value }, isDraft
        ).subscribe((res) => {
          this.router.navigate(['/portal'], { queryParams: { page: 'onboarding', onboardingPage: 'product-list' } });
        }, () => {
          this.submitted = false;
          this.loading = false;
          this.draftSaving = false;
          this.cdRef.detectChanges();
        });
      } else {
        this.apiService.addProduct(
          { ...value },
          isDraft,
          this.supplier.id
        ).subscribe((res) => {
          this.router.navigate(['/portal'], { queryParams: { page: 'onboarding', onboardingPage: 'product-list' } });
        }, () => {
          this.submitted = false;
          this.loading = false;
          this.draftSaving = false;
          this.cdRef.detectChanges();
        });
      }
    } else {
      this.loading = false;
      this.cdRef.detectChanges();
    }
  }

  private transformProductForSubmit(product) {
    const tempProduct = {
      details: { ...product },
      access: { ...product.dataAccess, ...product.productHosting },
      charges: { ...product.charges },
      licensing: { ...product.licensing },
      specialConditions: { ...product.specialConditions },
    };
    tempProduct.details.rapidPOC = tempProduct.details.rapidPOC === true ? 'yes' : 'no';
    delete tempProduct.details.charges;
    delete tempProduct.details.licensing;
    delete tempProduct.details.specialConditions;
    delete tempProduct.details.dataAccess;
    delete tempProduct.details.productHosting;
    return tempProduct;
  }

  private transformLicensingData(licensing) {
    const tempLicensing = { ...licensing };
    tempLicensing.openSource = tempLicensing.openSource === true || tempLicensing.openSource === 'yes';
    tempLicensing.thirdPartyTester = tempLicensing.thirdPartyTester === true || tempLicensing.thirdPartyTester === 'yes';
    tempLicensing.thirdParty = tempLicensing.thirdParty === true || tempLicensing.thirdParty === 'yes';
    return tempLicensing;
  }

  private transformAccessData(access) {
    const tempAccess = { ...access };
    tempAccess.thirdPartyInfrastructure = tempAccess.thirdPartyInfrastructure === true || tempAccess.thirdPartyInfrastructure === 'yes';
    tempAccess.accessTime = tempAccess.accessTime === true || tempAccess.accessTime === 'yes';
    tempAccess.personalDataTransfer = tempAccess.personalDataTransfer === true || tempAccess.personalDataTransfer === 'yes';
    return tempAccess;
  }

  private transformSpecialConditionsData(specialConditions) {
    const tempSpecialConditions = { ...specialConditions };
    tempSpecialConditions.useCase = tempSpecialConditions.useCase === true || tempSpecialConditions.useCase === 'yes';
    return tempSpecialConditions;
  }

  private transformChargesData(charges) {
    const tempCharges = { ...charges };
    tempCharges.trial = tempCharges.trial ? tempCharges.trial : tempCharges.chargesTrialFee === 'yes' ? 'fixedFee' : 'free';
    return tempCharges;
  }

  private transformOldData(product) {
    if (!product.details.applicationSoftware) {
      return product;
    }
    const tempProduct = {
      ...product,
      details: {
        ...product.details,
        applicationSoftware: {
          ...product.details.applicationSoftware,
          thirdParty: product.details.applicationSoftware.isThirdParty,
          thirdPartyTester: product.details.applicationSoftware.isAllowToTest,
        },
        productHosting: {
          ...product.details.productHosting,
          thirdPartyInfrastructure: product.details.productHosting.hasInfrastructure,
        },
        dataAccess: {
          ...product.details.dataAccess,
          accessTime: product.details.dataAccess.canTestAnyTime,
          personalDataTransfer: product.details.dataAccess.processPersonal,
        },
        charges: {
          ...product.details.charges,
          chargesAmtFee: product.details.charges.trialAmount,
        },
        useCases: {
          ...product.details.useCases,
          useCases: product.details.useCases.description
        }
      }
    };
    return tempProduct;
  }

  private isFormValid(): boolean {
    let isValidForm = true;
    for (const subFormKV of Object.entries(this.tracker.data.productSettings)) {
      if (!subFormKV[1]) {
        isValidForm = false;
      }
    }
    return isValidForm && this.productForm.valid;
  }
}
