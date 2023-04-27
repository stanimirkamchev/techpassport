import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { UploadModalComponent } from '@shared/modals/upload-modal/upload-modal.component';

import { ApiService } from '@services/api/api.service';
import { getData } from 'country-list';

import { ResizedEvent } from 'angular-resize-event';

import { ProductElement } from '@services/product/product.service';

import { Store } from '@ngrx/store';
import { loadProductDetails } from 'src/app/admin/store/product/product.actions';
import { State } from 'src/app/admin/store';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

export interface ChipsOptions {
  all: Array<string>;
  options: Array<string>;
  filtered: Observable<string[]>;
  selected: Array<string>; // string[];
}

@Component({
  selector: 'app-product-onboarding-modal',
  templateUrl: './product-onboarding-modal.component.html',
  styleUrls: ['./product-onboarding-modal.component.scss']
})
export class ProductOnboardingModalComponent implements OnInit {

  public product: ProductElement;
  public action = 'add';
  public showDays = false;
  public showTime = false;
  public fromDateValue: Date = new Date('1/1/2020 10:00 AM');
  public toDateValue: Date = new Date('1/1/2020 10:00 AM');
  public membership = 'none';
  public rapid = false;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public onboarding = true;
  public requestInProgress = false;
  public message = '';
  public detailsFormGroup: FormGroup;
  public licensingFormGroup: FormGroup;
  public accessFormGroup: FormGroup;
  public chargesFormGroup: FormGroup;
  public specialConditionsFormGroup: FormGroup;

  public allCoutries = getData();

  public allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public daysControl = new FormControl(new Set());

  public sentToReview = false;

  public videoName = null;

  public tooltipsInfo = {
    position: 'after',
    placeholder: 'Lorem Ipsum',
    detailsForm: {
      rapidPOC: 'Use of synthetic data and externally hosted or hosted on a standalone sandbox which makes the trial a low risk one.',
      name: 'This is the name that will appear in searches',
      type: 'This filed is searchable by potential customers, so please make sure you have selected which best suits your product',
      description: 'Please provide and accurate description, in line with any marketing that you may already have, potential customers are likely to review this',
      // video:  "Video... Layla to Provide",
      tags: 'Separated with comma'
      // documentationDescription:  "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      // documentation: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    licensingForm: {
      softwareLicence: 'For POC testing puproses where software is provided as a licence',
      /*copiesLimit                 : "Lorem Ipsum",
      maxCopiesLimit              : "Lorem Ipsum",
      anyTerritory                : "Lorem Ipsum",
      includedTerritories         : "Lorem Ipsum",*/
      additionalRestrictions: 'This refers to limitations during POC testing where software copies are provided for bank internally hosted platforms',
      openSource: 'Open-source software (OSS) is any computer software that\'s distribiuted with its source code available for modification. That means it usually includes a license for programmers to change the software in any way they choose. They can fix bugs, improve functions, or adapt the software to suit their own needs.',
      openSourceList: 'Separated with comma',
      // thirdPartyTester            : "Lorem Ipsum",
      // thirdParty                  : "Lorem Ipsum",
      thirdPartyList: 'Separated with comma'
    },

    accessForm: {
      usersLimit: 'This refers to user limitations during POC where externally hosted services are offered',
      personalDataPOC: 'Personally Identifable Information, PII, is any data that could potentially be used to identify a particular person.Example include a full name, Social Security number, driver\'s license number, part or all of a bank account number, passport number, and email address.',
      personalData: 'This is in relation to what type of data will be used in service,post POC',
      personalDataLocations: 'Please select the countries from where you will provide the services specifically for PII data',
      personalDataTransfer: 'EEA is defined as European Economic Area',
      personalDataTransferMeasures: 'You MUST provide a detailed description for how your organisation will ensure that any PII data is stored and handled securely in line with legislative guidelines. Please refer to our guidencenotes for further support (Security and Cyber). The provision of an accurate and appropriate description is very important at and will form part of your POC contract with potential customers. Imitting details here could reduce your chances of success or cause details during contract negotiations.'
    },
    /*  chargesForm: {
        chargesTrialFee             : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        chargesAmtFee               : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        chargesCaseBasis            : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        currency                    : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      }*/
    specialConditionsForm: {
      useCase: 'Please provide an example of a use case which your product has been utilised or tested. AVOID referencing any client that this relates to. This is helpful for potential customers to understand if their use case aligns to yours.'
      // specialConditions           : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      // specialConditionsList       : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    }

    /*auditingRightsForm: {
      auditRights                 : "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      thirdPartyAuditRights       : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    }*/

  };
  public selectedTypes = [];
  public allProductTypesNew = [];
  public allTags = ['Artificial Intelligence', 'Big Data', 'Blockchain', 'Chatbots', 'Crowdfunding',
    'Digital Identification', 'Machine Learning', 'P2P Lending', 'Robo-Advisors', 'Robotic Process Automation (RPA)'];
  public chips = {
    softwareTechnology: {selected: []} as ChipsOptions,
    openSourceList: {selected: []} as ChipsOptions,
    thirdPartyList: {selected: []} as ChipsOptions
  };

  @ViewChild('softwareInput') softwareInput: ElementRef<HTMLInputElement>;
  @ViewChild('openSourceListInput') openSourceListInput: ElementRef<HTMLInputElement>;
  @ViewChild('thirPartiesInput') thirPartiesInput: ElementRef<HTMLInputElement>;
  @ViewChild('selectedTypesSel') selectedTypesSel: MatSelect;

  constructor(
    private dialogRef: MatDialogRef<ProductOnboardingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductElement,
    private fb: FormBuilder,
    private alertDialog: MatDialog,
    private uploadDialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
    private store: Store<State>
  ) {


    if (data._id && !data.id) {
      data.id = data._id;
    } // TO DO change id to _id - make it consistant

    if (data && data.id) {
      this.action = 'edit';
    }

    this.product = data;
    this.detailsFormGroup = fb.group({
      rapidPOC: new FormControl('yes', Validators.minLength(2)),
      name: new FormControl('', Validators.minLength(2)),
      type: new FormControl('', Validators.minLength(1)),
      description: new FormControl('', Validators.minLength(2)),
      video: new FormControl('', Validators.minLength(2)),
      documentation: new FormControl(''), // , Validators.minLength(2)),
      documentationDescription: new FormControl('', Validators.minLength(0)),
      tags: new FormControl('', Validators.minLength(1)),
      // productType: new FormControl('', Validators.minLength(1))
    });
    this.licensingFormGroup = fb.group({

      softwareLicence: new FormControl(''),
      copiesLimit: new FormControl(''),
      maxCopiesLimit: new FormControl(''),
      anyTerritory: new FormControl(''),
      includedTerritories: new FormControl(''),
      additionalRestrictions: new FormControl(''),

      openSource: new FormControl(''),
      openSourceList: new FormControl(''),

      thirdParty: new FormControl(''),
      thirdPartyList: new FormControl(''),
      thirdPartyTester: new FormControl('')// [Validators.minLength(2), Validators.required]
    });
    this.accessFormGroup = fb.group({
      testEnviroment: new FormControl(''),

      usersLimit: new FormControl(''),
      maxUsersLimit: new FormControl(''),

      testingPurposes: new FormControl(''),
      testEnviromentDescription: new FormControl(''),
      accessTime: new FormControl(''),
      hostedLive: new FormControl(''),
      hostedLiveSolution: new FormControl(''),
      thirdPartyInfrastructure: new FormControl(''),
      leadTime: new FormControl(''),
      additionalServicesDescription: new FormControl(''),
      servicesLocations: new FormControl(),
      personalDataPOC: new FormControl(),
      personalDataServices: new FormControl(),
      personalDataLocations: new FormControl(),
      personalDataTransfer: new FormControl(),
      personalDataTransferMeasures: new FormControl(),
      personalDataEmployeesTestingAccess: new FormControl(),
      testingAccessToNone: new FormControl(''),
      testingAccessToData: new FormControl(''),
      testingAccessToSytems: new FormControl(''),
      testingAccessToInfrastructure: new FormControl(''),
      testingAccessToPremises: new FormControl(''),
      personalDataEmployeesLiveAccess: new FormControl(''),
      liveAccessToNone: new FormControl(''),
      liveAccessToData: new FormControl(''),
      liveAccessToSytems: new FormControl(''),
      liveAccessToInfrastructure: new FormControl(''),
      liveAccessToPremises: new FormControl(''),
      accessTimeFrom: new FormControl(''),
      accessTimeTo: new FormControl('')
    });
    this.chargesFormGroup = fb.group({
      chargesTrialFee: new FormControl(''),
      chargesAmtFee: new FormControl(''),
      // chargesCaseBasis: new FormControl(''),
      currency: new FormControl('usd', Validators.minLength(3))
    });
    this.specialConditionsFormGroup = fb.group({
      // specialConditions: new FormControl('', [Validators.minLength(2), Validators.required]),
      // specialConditionsList: new FormControl('', Validators.minLength(0)),
      useCase: new FormControl('', Validators.minLength(2)),
      useCases: new FormControl('', Validators.minLength(2))
    });

    /* this.apiService.getProductTags()
       .pipe(map(res => res.map(({ tags }) => tags))) //extract
       .pipe(map(res => res.filter(tags => tags && tags.length))) //not empty
       .pipe(map(res => res.reduce((acc, curr) => (curr.forEach(t => acc.push(t)), acc), []))) //concat
       //.pipe(map(tags => ([...new Set([...tags, ...this.chips.tags.all])]))) //unique
       .pipe(map(tags => tags.sort())) //a-z
       .subscribe(tags => {
         this.chips.tags.all = tags;
         this.chips.tags.options = this.chips.tags.all.slice();
         this.chips.tags.filtered = this.detailsFormGroup.controls.tags.valueChanges.pipe(
           startWith(null),
           map((tag: string | null) => {
             return tag ? this._filter(tag, 'tags') : this.chips.tags.options.slice();
           }
           ));

       });*/

    /*this.chips.productType.filtered = this.detailsFormGroup.controls.productType.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => {
        return tag ? this._filter(tag, 'tags') : this.chips.productType.options.slice();
      }
      ));*/

    if (this.action === 'edit') {
      //  this['detailsFormGroup'].controls['name'].setValue(data.name);
      this.apiService.getProductDetails(data.id).subscribe(
        (httpResponse: HttpResponse<object> | any) => {
          const response = httpResponse.body as any;
          // for (let ind in this['detailsFormGroup'].controls){
          const product = response.body as any;
          for (const ind in product.details.details) {
            if (ind === 'videoName') {
              this.videoName = product.details.details[ind];
              continue;
            }
            if (!this.detailsFormGroup.controls[ind]) {
              continue;
            }


            this.detailsFormGroup.controls[ind].setValue(product.details.details[ind]);
          }
          // this.chips.tags.selected = product.tags.tags;
          this.detailsFormGroup.controls.tags.setValue(product.tags.tags);
          /*if (typeof product.details.details.type === 'string')
            this.chips.productType.selected = [product.details.details.type];
          else if (typeof product.details.details.type === 'object')
            this.chips.productType.selected = product.details.details.type;*/


          for (const ind in product.details.licensing) {
            if (!this.licensingFormGroup.controls[ind] || ind === 'openSourceList' || ind === 'thirdPartyList') {
              continue;
            }
            this.licensingFormGroup.controls[ind].setValue(product.details.licensing[ind]);
          }
          for (const ind in product.details.access) {
            if (!this.accessFormGroup.controls[ind]) {
              continue;
            }
            this.accessFormGroup.controls[ind].setValue(product.details.access[ind]);
          }
          for (const ind in product.details.charges) {
            if (!this.chargesFormGroup.controls[ind]) {
              continue;
            }
            this.chargesFormGroup.controls[ind].setValue(product.details.charges[ind]);
          }

          for (const ind in product.details.specialConditions) {
            if (!this.specialConditionsFormGroup.controls[ind]) {
              continue;
            }
            this.specialConditionsFormGroup.controls[ind].setValue(product.details.specialConditions[ind]);
          }

          if (product.details.licensing.openSourceList) {
            this.chips.openSourceList.selected = product.details.licensing.openSourceList;
          }
          if (product.details.licensing.thirdPartyList) {
            this.chips.thirdPartyList.selected = product.details.licensing.thirdPartyList;
          }

        }, (respError: Error) => {
          console.log('product details error:', respError);
        });
    }
  }

  ngOnInit() {
    this.membership = this.apiService.sessionObject.membership;
    this.rapid = this.apiService.sessionObject.rapid;
    if (!this.membership) {
      const sID: string = this.data.supplierId || this.data.supplier._id;
      this.apiService.adminGetSupplierReview(sID)
        .subscribe(sup => {
          this.membership = sup.members?.toLowerCase();
        });

    }
    this.apiService.getSupplierTaxonomyTags()
      .subscribe(tags => {
        this.allProductTypesNew = tags.body;
      });


  }

  onResized(event: ResizedEvent) {
    // let scrollTop = event.element.nativeElement.scrollHeight;
    // TweenMax.to(event.element.nativeElement.offsetParent, 0.8, { scrollTop: scrollTop, ease: Power1.easeOut });
  }

  showThisField(form, parent, me, additional?) {
    try {
      let base: boolean = (this[form].get(parent).valid && this[form].get(parent).value.length > 0);
      if (this[form].get(me)) {/// DEV
        base = base || (this[form].get(me).value && this[form].get(me).value.length > 0);
      }// DEV (to do day/time picker)

      if (additional) {
        base = base || this[form].get(additional.field).value === additional.value;
      }
      return base;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  editVideo(edit: boolean) {
    const ref = this.uploadDialog.open(UploadModalComponent, {
      width: '380px',
      height: '420px',
      disableClose: true,
      data: {type: 'mov', productId: this.product.id, edit, supplierId: this.data.supplierId}
    });
    ref.afterClosed().subscribe(result => {
      // if (this.detailsFormGroup.name)
      if (result && result.media) {
        this.detailsFormGroup.controls.video.setValue('yes');
        this.videoName = result.media;
        if (!this.product?.id) {
          this.product = {id: result.product};
        }
      } else {
        this.detailsFormGroup.controls.video.setValue('no');
        this.videoName = null;
      }
    });
  }

  vidStepChanged(event) {

    if (this.detailsFormGroup.get('video').value === 'yes') {
      this.editVideo(false);
    }
  }

  stepChanged(event) {
    this.message = '';
  }

  goForward(stepper) {
    if (stepper.selectedIndex === 4) {
      return this.onboarding = false;
    }
    stepper.next();
  }

  goBack(stepper) {
    stepper.previous();
  }

  async save(draft: boolean) {
    /*let product = {
     ...this.detailsFormGroup.value,
     ...this.softwareFormGroup.value,
     ...this.restrictionsFormGroup.value,
     ...this.dataFormGroup.value,
     ...this.chargesFormGroup.value,
     ...this.specialConditionsFormGroup.value
   }*/

    this.requestInProgress = true;

    const product = {
      details: this.detailsFormGroup.value,
      licensing: this.licensingFormGroup.value,
      access: this.accessFormGroup.value,
      charges: this.chargesFormGroup.value,
      specialConditions: this.specialConditionsFormGroup.value,
    };

    // product.details.tags = this.chips.tags.selected;
    // product.details.type = this.chips.productType.selected;
    product.details.videoName = this.videoName;

    product.licensing.openSourceList = this.chips.openSourceList.selected;
    product.licensing.thirdPartyList = this.chips.thirdPartyList.selected;
    // product.specialConditions.useCases = this.chips.useCases.selected;
    let action;
    if (this.product?.id) {
      this.apiService.updateProduct(this.product.id, product, draft).subscribe((data: HttpResponse<Object>) => {
        this.requestInProgress = false;
        if (!draft) {
          this.sentToReview = true;
        } else {
          this.fin();
        }
        // this.message = 'Thank you for your submission, The TechPassport Team will respond within 24 hours!';
      }, (respError: Error) => {
        this.requestInProgress = false;
        this.message = (respError as any).error.message;
      });
    } else {

      this.apiService.addProduct(product, draft, this.data.supplierId).subscribe((data: HttpResponse<Object>) => {
        this.requestInProgress = false;
        if (!draft) {
          this.sentToReview = true;
        } else {
          this.fin();
        }
      }, (respError: Error) => {
        this.requestInProgress = false;
        this.message = (respError as any).error.message;
      });
    }
  }

  isValidated(stepper) {
    // return true; /// EEV DEV !!!
    switch (stepper.selectedIndex) {
      case 0: {
        return this.detailsFormGroup.valid; // && this.chips.tags.selected.length > 0 // TODOproductType && this.chips.productType.selected.length > 0;
      }
      case 1: {
        return this.licensingFormGroup.valid; // && thirdPartyTester
      }
      case 2: {
        // let formDt = this.accessFormGroup.value;
        return this.accessFormGroup.valid;
      }
      case 3: {
        return this.chargesFormGroup.value.chargesTrialFee === 'no' || (this.chargesFormGroup.value.chargesTrialFee === 'yes' && !isNaN(parseInt(this.chargesFormGroup.value.chargesAmtFee)) && this.chargesFormGroup.value.chargesAmtFee > 0);
      }
      case 4: {
        return this.specialConditionsFormGroup.valid || this.specialConditionsFormGroup.value.useCases === 'no';
      }
    }

    return false;
  }

  ///
  addTag(event: MatChipInputEvent, formGroup: string, field: string): void {
    // To make sure this does not conflict with OptionSelected Event
    if (!this[`${field}Autocomplete`] || !this[`${field}Autocomplete`].isOpen) {
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        this.chips[field].selected.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      this[formGroup].controls[field].setValue(null);
    }
  }

  removeTag(tag: string, formGroup: string, field: string): void {
    const index = this.chips[field].selected.indexOf(tag);

    if (index >= 0) {
      this.chips[field].selected.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent, formGroup: string, field: string): void {
    this.chips[field].selected.push(event.option.viewValue);
    this[`${field}Input`].nativeElement.value = '';
    this[formGroup].controls[field].setValue(null);
  }

  private _filter(value: string, field: string): string[] {
    const filterValue = value.toLowerCase();
    return this.chips[field].options.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }


  get days() {
    return this.daysControl.value;
  }

  toggleDay = (chip: any) => {
    const addChip = () => {
      this.days.add(chip);
    };
    const removeChip = () => {
      this.days.delete(chip);
    };
    this.days.has(chip) ? removeChip() : addChip();
  }

  // onClickedOutside(e: Event) {
  //  console.log('Clicked outside:', e);
  // }

  ///
  exit() {
    if (this.onboarding === false || this.detailsFormGroup.value.name.length === 0) {
      return this.fin(false);
    }
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '300px',
      height: '240px',
      disableClose: true,
      data: {
        title: 'Do you want to save product as draft?',
        message: '',
        links: null,
        actions: [{label: 'Yes', color: 'accent'}, {label: 'No', color: 'warn'}, {label: 'Cancel', color: 'primary'}]
      }
    });
    ref.afterClosed().subscribe(result => {
      // if (this.detailsFormGroup.name)
      if (this.data.id && this.apiService.sessionObject.type === 'portalAdmin') {
        this.store.dispatch(loadProductDetails({id: this.data.id}));
      }

      if (result === 'Yes') {
        this.save(true);
        if (this.apiService.sessionObject.type === 'supplier') {
          this.router.navigateByUrl('/portal');
        }
        // this.dialogRef.close();
      } else if (result === 'No') {
        this.dialogRef.close();
      }


    });
  }

  fin(redr?: boolean) {
    this.dialogRef.close();
    if (redr === true && this.apiService.sessionObject.type === 'supplier') {
      this.router.navigateByUrl('/portal');
    }
    if (this.data.id && this.apiService.sessionObject.type === 'portalAdmin') {
      this.store.dispatch(loadProductDetails({id: this.data.id}));
    }
  }

  // allSelected = false;

  toggleAllSelection(groupIndex) {
    this.allProductTypesNew[groupIndex].allSelected = !this.allProductTypesNew[groupIndex].allSelected;
    if (this.allProductTypesNew[groupIndex].allSelected) {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        const f = this.allProductTypesNew[groupIndex].items.find(x => x.value === item.value);
        if (f) {
          item.select();
        }
      });
    } else {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        const f = this.allProductTypesNew[groupIndex].items.find(x => x.value === item.value);
        if (f) {
          item.deselect();
        }
      });
    }
    for (let i = 0; i < this.allProductTypesNew[groupIndex].items.length; i++) {
      this.toggleLevel2Selection(groupIndex, i);
    }
  }

  toggleLevel2Selection(groupIndex, level2Index) {
    this.allProductTypesNew[groupIndex].items[level2Index].allSelected = !this.allProductTypesNew[groupIndex].items[level2Index].allSelected;
    if (this.allProductTypesNew[groupIndex].items[level2Index].allSelected) {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        // if (this.allProductTypesNew[groupIndex].items[level2Index].items.indexOf(item.value) > -1)
        if (this.allProductTypesNew[groupIndex].items[level2Index].items.find(x => x.value === item.value)) {
          item.select();
        }
      });
    } else {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        // if (this.allProductTypesNew[groupIndex].items[level2Index].items.indexOf(item.value) > -1)
        if (this.allProductTypesNew[groupIndex].items[level2Index].items.find(x => x.value === item.value)) {
          item.deselect();
        }
      });
    }
  }


}
