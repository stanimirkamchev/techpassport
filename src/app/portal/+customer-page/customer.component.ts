import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EventEmitterService } from '../../common/services/event-emitter/event-emitter.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// import { MockPocDataProducts } from './../poc-modal/poc-mock-data'; //Product
// import { PocModalComponent } from './../poc-modal/poc-modal.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { getData } from 'country-list';

import { ApiService } from '@services/api/api.service';
import { HttpResponse } from '@angular/common/http';
import { ComplianceModalComponent } from '../compliance-modal/compliance-modal.component';
import { ConnectMeService } from '../../common/services/connectme/connectme.service';
import { DocuSignComponent } from '@shared/modals/docu-sign-modal/docu-sign.component';
import { InviteSupplierComponentComponent } from 'src/app/invite-supplier-component/invite-supplier-component.component';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

export interface MarketItem {
  loading: boolean;
  compareList: boolean;
}
export interface Company extends MarketItem {
  id: string;
  name: string;
  about: string;
  stamps: any;
  logo: string;
  region?: string;
  supplierID?: string;
}

export interface Product extends Company {
  productName: string;
  type?: string;
  description?: string;
  productID?: string;
  details?: any;
  detiails?: any;
  trialFee?: any;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerPageComponent implements OnInit {

  constructor(
    private registerDialog: MatDialog,
    private inviteDialog: MatDialog,
    public eventEmitterService: EventEmitterService,
    private docuSignDialog: MatDialog,
    public apiService: ApiService,
    public connectMeService: ConnectMeService,
    @Inject(DOCUMENT) document
  ) {
    this.filteredRegions = this.regionsCtrl.valueChanges.pipe(
      startWith(null),
      map((region: string | null) =>
        region ? this._filter(region) : this.allregions.slice()
      )
    );

  }
  public topTech: Company;
  public productsSearches: Product[];
  public productsBasedOnPrev: Product[];
  public allCoutries = []; // getData();

  public products: Product[]; // = MockPocDataProducts;
  public filteredProducts = []; // this.products;

  visible = true;
  selectable = true;
  removable = true;

  trial = false; // <<<<<<<
  topTechEnabled = false;

  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public regionsCtrl = new FormControl();
  public allFunctionalityCtrl = new FormControl('');
  public includedTerritories = new FormControl('');
  public freeTextCtrl = new FormControl('');
  public functionalityTextCtrl = new FormControl('');


  /*public complianceAllCtrl = new FormControl(true);
   public complianceGoldCtrl = new FormControl('');
   public complianceSilverCtrl = new FormControl('');
   public complianceBronzeCtrl = new FormControl('');*/
  public compilance = {
    all: false,
    SOC2: false,
    ISP: false,
    SQ: false,
    ISO27001: false,

  };
  public membership = {
    all: false,
    core: false,
    premium: false,
  };
  public insurance = {
    all: false,
    full: false,
    employee: false,
    public: false,
    cyber: false,
  };
  public useCase: any = false;
  public rapidPOC: any = false;
  useCaseText = '';
  supplierEngaged = false;

  supplierMaturity = {
    banking: false,
    insurance: false,
    wealthManagement: false,
    lifeAssurancePensions: false,
    regulatory: false,
    assetManagement: false,
    maxMaturity: 0,
  };

  pocCharge = {
    no: false,
    isSet: false,
    maxCharge: 5000
  };
  public pocChargeInterval = 10;
  public pocMaxCharge = 1000;

  public keywordsCtrl = new FormControl('');
  public productTypeCtrl = new FormControl([]);
  public suppliersCtrl = new FormControl();
  public productsCtrl = new FormControl();
  public filteredRegions: Observable<string[]>;

  public allproductType: any[] = [];
  public allSuppliers: any[];
  public allProducts: any[];
  public allFunction: string[] = [];
  public allKeywords: string[];

  public allregions: string[] = [
    'United Kingdom',
    'United States',
    'Singapore',
  ];
  public compareProducts: Product[] = [];
  public compateProudctsTemp;
  public showCompareDialog = false;
  public showCompareButton = false;
  public showCompareList = false;
  public showDetailCompare = false;
  public gridDisplay = 'grid';

  // Collaspace filter
  public collComp = false;
  public collInsur = false;
  public collMember = false;
  public collUserCase = false;
  public collRapidPOC = false;
  public collOrigin = false;
  public collFunctionality = false;
  public collTags = false;
  public collTechnology = false;
  public collSupplier = false;
  public collProduct = false;




  colMaturityMin = 0;
  colMaturityMax = 100;
  colMaturity = false;

  colPocCharge = false;

  //
  public functionality: string[] = [];
  public territory: string[] = [];
  public regions: string[] = [];
  public productType: string[] = [];
  public suppliers: string[] = [];
  public keywords: string[] = [];
  private searchInputTimer: any;

  public showSearchRes = false;
  public searching = false;
  private productsCriteria: any = {};


  public selectedTypes = [];
  // allProductTypesNew


  @ViewChild('regionsInput') regionsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('productTypeInput') productTypeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto1') matAutocomplete1: MatAutocomplete;
  @ViewChild('suppliersInput') suppliersInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto3') matAutocomplete3: MatAutocomplete;
  @ViewChild('keywordsInput') keywordsInput: ElementRef<HTMLInputElement>;
  @ViewChild('autoK') matAutocompleteK: MatAutocomplete;
  @ViewChild('selectedTypesSel') selectedTypesSel: MatSelect;

  supplierMaturityDebouncer: Subject<[any, any]> = new Subject<
    [any, any]
  >();

  pocChargeDebouncer: Subject<[any, any]> = new Subject<
    [any, any]
  >();

  clearFilters(e: Event) {
    e.preventDefault();
    [
      this.freeTextCtrl,
      this.includedTerritories,
      this.allFunctionalityCtrl,
      this.productTypeCtrl,
      this.suppliersCtrl,
      this.productsCtrl,
      this.keywordsCtrl,
      this.functionalityTextCtrl,
      this.includedTerritories
    ]
      .filter(({ pristine: p }) => !p)
      .forEach((control) => {
        control.reset();
        control.updateValueAndValidity();
      });
    this.useCase = false;
    this.rapidPOC = false;
    this.suppliers = [];
    this.selectedTypes = [];
    this.compilance = {
      all: false,
      SOC2: false,
      ISP: false,
      SQ: false,
      ISO27001: false,
    };
    this.membership = {
      all: false,
      core: false,
      premium: false,
    };
    this.insurance = {
      all: false,
      full: false,
      employee: false,
      public: false,
      cyber: false,
    };
    this.supplierMaturity = {
      banking: false,
      insurance: false,
      wealthManagement: false,
      lifeAssurancePensions: false,
      regulatory: false,
      assetManagement: false,
      maxMaturity: 0,
    };
    this.pocCharge = {
      isSet: false,
      no: false,
      maxCharge: 5000
    };
    this.useCaseText = '';
    this.initStartPage();
    this.doSearch(true);
  }

  hasDetailsAccess(product: any) {
    return product.reviewConnectionStatus === 'completed' || product.offConnectionStatus === 'completed';
  }
  isRapidNDA(product: any) {
    return product.rapidNDA === true;
  }
  isRapidPOC(product: any) {
    return product.rapidPOC === true;
  }


  checkPermissionsForButton(product: any, type: string) {
    try {
      if (
        !this.apiService.sessionObject ||
        !this.apiService.sessionObject.permissions ||
        !(this.apiService.sessionObject.permissions as any).details
      ) {
        return false;
      }
      if (type === 'info') {
        return (
          product.offConnectionStatus !== 'completed' &&
          product.reviewConnectionStatus !== 'completed' &&
          (this.apiService.sessionObject.permissions as any).details.indexOf('R') > -1
        );
      }
      if (type === 'details') {
        return (
          (product.offConnectionStatus === 'completed' ||
            (product.reviewConnectionStatus === 'completed' && product.rapidNDA === true)) &&
          (this.apiService.sessionObject.permissions as any).details.indexOf('R') > -1
        );
      }
      if (type === 'poc') {
        return product.nda || (product.rapidPOC && this.apiService.sessionObject.rapid);
      }// product.rapidPOC;// || product.offConnectionStatus === 'completed';


      if (type === 'nda') {
        return !product.nda && this.apiService.sessionObject.requireNDA;
      }// !product.rapidNDA && !product.offConnectionStatus;/// <<< AD THIS

      if (type === 'compliance') {
        return this.apiService.sessionObject.rapid && product.rapidPOC && !this.apiService.sessionObject.requireNDA;
      }// product.nda;//product.rapidNDA && (!product.reviewConnectionStatus || product.reviewConnectionStatus === '')


      if (type === 'ndaInfo') {
        return (product.reviewConnectionStatus
          && (product.reviewConnectionStatus !== 'completed' && product.reviewConnectionStatus !== 'declined'))
          || (product.offConnectionStatus && product.offConnectionStatus !== 'completed');
      }
    } catch (error) {
      // console.log(error);
    }
    return false;
  }

  ngOnInit() {
    this.initStartPage();
    this.doSearch(true);
    this.pocChargeDebouncer.pipe(debounceTime(1000))
      .subscribe(([k, v]) => this.pocChargeChange(k, v));

    this.supplierMaturityDebouncer.pipe(debounceTime(1000))
      .subscribe(([k, v]) => this.supplierMaturityChange(k, v));
  }

  initStartPage(): void {
    this.apiService.companySearchProductList().subscribe(
      (data: HttpResponse<any>) => {
        try {

          const body = data.body as any;
          this.allproductType = body.types;
          this.allProducts = body.products;
          this.pocCharge.maxCharge = body.maxFee;
          this.pocMaxCharge = body.maxFee;
          this.allFunction = body.tags;
          this.pocChargeInterval = Math.floor(body.maxFee * 0.05);

          this.allProducts.sort((a, b) => {
            try {
              const nameA = a.name.toUpperCase().trim();
              const nameB = b.name.toUpperCase().trim();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
            } catch (err) {
              console.log(err, a, b);
            }
            return 0;
          });


        } catch (error) {
          console.log(error);
        }
      },
      (respError: Error) => {
        console.log(respError);
      }
    );

    this.apiService.companySearchList().subscribe(
      (data: HttpResponse<any>) => {
        const body = data.body as any;
        this.allSuppliers = [];
        this.allCoutries = [];
        const coutries = getData();
        const coutriesTMP = [];
        let i;
        let j;

        for (i = 0; i < body.length; i++) {
          this.allSuppliers.push(body[i]);
          const c = body[i].coutry.toUpperCase();
          if (coutriesTMP.indexOf(c) === -1) {
            coutriesTMP.push(c);
          }
        }

        this.allSuppliers.sort((a, b) => {
          const nameA = a.name.toUpperCase().trim();
          const nameB = b.name.toUpperCase().trim();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        for (i = 0; i < coutriesTMP.length; i++) {
          for (j = 0; j < coutries.length; j++) {
            if (coutries[j].code === coutriesTMP[i]) {
              this.allCoutries.push(coutries[j]);
              break;
            }
          }
        }


      },
      (respError: Error) => { }
    );
    this.apiService.companySearchTopTech().subscribe(
      (data: HttpResponse<any>) => {
        const body = data.body as any;
        this.topTech = body as Company;
      },
      (respError: Error) => { }
    );
    this.apiService.companySearchBasedOnPrev().subscribe(
      (data: HttpResponse<any>) => {
        const body = data.body as any;
        this.productsBasedOnPrev = [];
        for (const ind of body) {
          this.productsBasedOnPrev.push(ind as Product);
        }
        this.filteredProducts = this.productsBasedOnPrev;
      },
      (respError: Error) => { }
    );
  }

  compilanceModal(compliance, insurance, details, product, company?) {
    this.registerDialog.open(ComplianceModalComponent, {
      width: '80vw',
      height: '84vh',
      maxWidth: undefined,
      disableClose: false,
      data: {
        complianceShow: compliance,
        insuranceShow: insurance,
        detailsShow: details,
        companyShow: company,
        product,
      },
    });
  }

  openDocuSign(url: string) {
    const ref = this.docuSignDialog.open(DocuSignComponent, {
      width: '89vw',
      height: '89vh',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data: { url },
    });
    ref.afterClosed().subscribe((result) => { });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allregions.filter(
      (region) => region.toLowerCase().indexOf(filterValue) === 0
    );
  }
  private _filter1(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allproductType.filter(
      (productType) => productType.toLowerCase().indexOf(filterValue) === 0
    );
  }
  private _filterK(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allKeywords.filter(
      (keyword) => keyword.toLowerCase().indexOf(filterValue) === 0
    );
  }
  public getAssessments(assessments) {
    const a = [];
    // tslint:disable-next-line:forin
    for (const ind in assessments) {
      a.push({ key: ind, value: assessments[ind] });
    }
    return a;
  }

  addCompare(product, id, event) {
    const productDetails$ = this.apiService
      .getProductDetails(id)
      .pipe(map((r) => r.body));
    const supplierDetails$ = this.apiService
      .companyPOCProductDetails(id)
      .pipe(map((r) => r.body))
      .pipe(map((b) => b.supplier));
    forkJoin([productDetails$]).subscribe(([productDetails]) => {
      supplierDetails$.subscribe((d) => (product.supplierDetails = d));
      this.compateProudctsTemp = productDetails;
      product.compareList = true;
      product.charges = this.compateProudctsTemp.details.charges;
      product.numusers = this.compateProudctsTemp.details.access.maxUsersLimit;
      product.sofcopier = this.compateProudctsTemp.details.licensing.maxCopiesLimit;
      product.timeframe = this.compateProudctsTemp.details.access.leadTime;
      product.personaldata = this.compateProudctsTemp.details.access.personalDataPOC;
      // product.compliance = product.compliance;

      this.compareProducts.push(product);
      if (this.compareProducts.length > 0 && this.compareProducts.length < 10) {
        this.showCompareDialog = true;
      }
      if (this.compareProducts.length > 1 && this.compareProducts.length < 10) {
        this.showCompareButton = true;
      } else {
        this.showCompareButton = false;
      }
    });
  }
  removeProductCampare(id) {
    const index = this.compareProducts.findIndex((x) => x.id === id);
    const index1 = this.products.findIndex((x) => x.id === id);
    this.products[index1].compareList = false;
    this.compareProducts.splice(index, 1);
    if (this.compareProducts.length > 1 && this.compareProducts.length < 10) {
      this.showCompareButton = true;
    } else {
      this.showCompareButton = false;
    }
    if (this.compareProducts.length < 1) {
      this.removeAllCompare();
    }
  }
  removeAllCompare() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.compareProducts.length; i++) {
      const index1 = this.products.findIndex(
        (x) => x.id === this.compareProducts[i].id
      );
      this.products[index1].compareList = false;
    }
    this.showCompareDialog = false;
    this.compareProducts = [];
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;


    // tslint:disable-next-line:no-unused-expression
    input.blur;
    // Add our region
    if ((value || '').trim()) {
      this.regions.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.regionsCtrl.setValue(null);
  }

  showDetail(id) {
    (document.querySelector('.details') as HTMLElement).style.display = 'none';
    document.getElementById('details-' + id).style.display = 'block';
  }
  showRevers(id) {
    (document.querySelector('.revers') as HTMLElement).classList.remove(
      'revers-active'
    );
    document.getElementById('revers-' + id).classList.add('revers-active');
    (document.querySelector('.top-menu') as HTMLElement).classList.remove(
      'revers-active'
    );
    document.getElementById('top-menu-' + id).classList.add('revers-active');
  }
  hiddenRevers(id) {
    document.getElementById('top-menu-' + id).classList.remove('revers-active');
    document.getElementById('revers-' + id).classList.remove('revers-active');
  }
  hiddenDetails(id) {
    document.getElementById('details-' + id).style.display = 'none';
  }
  async doSearch(all: boolean, dontchange?: boolean) {

    if (!dontchange) { this.searching = true; }

    this.apiService
      .productSearch(
        all,
        this.freeTextCtrl.value,
        this.includedTerritories.value,
        this.selectedTypes, // this.productTypeCtrl.value,
        this.keywords,
        this.suppliersCtrl.value,
        this.productsCtrl.value,
        this.allFunctionalityCtrl.value,
        this.functionalityTextCtrl.value,
        this.compilance,
        this.membership,
        this.insurance,
        this.useCase,
        this.rapidPOC,
        this.useCaseText,
        this.supplierMaturity,
        this.pocCharge
      )
      .subscribe(
        (data: HttpResponse<any>) => {
          const body = data.body as any;
          this.products = [];
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < body.length; i++) {
            this.products.push(body[i] as Product);
          }

          this.products.sort((a, b) => {
            const nameA = a.productName?.toUpperCase().trim();
            const nameB = b.productName?.toUpperCase().trim();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.filteredProducts = this.products;


          this.searching = false;
          /* this.allFunction = [
             ...new Set([
               ...this.allFunction,
               ...this.products
                 .map((p) => p["tags"])
                 .reduce((a, c) => a.concat(c), []),
             ]),
           ];*/
        },
        (respError: Error) => {
          this.searching = false;
        }
      );
  }

  productsSearch(category: string, value: any, force?: boolean) {
    if (typeof value.length === 'number' && value.length === 0) {
      delete this.productsCriteria[category];
    }
    else { this.productsCriteria[category] = value; }
    this.showSearchRes = Object.keys(this.productsCriteria).length > 0;
    clearTimeout(this.searchInputTimer);
    this.searchInputTimer = setTimeout(() => {
      this.doSearch(false);
    }, 220);

  }

  inputValue(category: string, event) {
    clearTimeout(this.searchInputTimer);
    this.searchInputTimer = setTimeout(() => {
      this.productsSearch(category, event.target.value);
    }, 300);
  }
  complianceChange(category: string, event) {
    this.productsSearch(category, this.compilance[category]);
  }
  membershipChange(category: string, event) {
    this.productsSearch(category, this.membership[category]);
  }
  insuranceChange(category: string, event) {
    this.productsSearch(category, this.insurance[category]);
  }
  useCaseChange(event) {
    this.productsSearch('useCase', this.useCase);
  }
  rapidPOCChange(event) {
    this.productsSearch('rapidPOC', this.rapidPOC);
  }


  supplierMaturityChange(category: string, value) {
    this.supplierMaturity[category] = value;
    this.productsSearch(category, value);
  }
  pocChargeChange(category: string, value) {
    this.pocCharge[category] = value;
    this.productsSearch(category, value);
  }

  selectedMulti(category: string, event) {
    this.productsSearch(category, event.value);
  }

  selected(category: string, event: MatAutocompleteSelectedEvent): void {
    this[category].push(event.option.viewValue);
    this[`${category}Input`].nativeElement.value = '';
    this[`${category}Ctrl`].setValue(null);
    this.productsSearch(category, this[category]);
  }
  remove(what: string, where: string): void {
    const index = this[where].indexOf(what);

    if (index >= 0) {
      this[where].splice(index, 1);
    }
    this.productsSearch(where, this[where]);
    /*   this.productsSearch(where);*/
  }
  add1(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our region
    if ((value || '').trim()) {
      this.productType.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.productTypeCtrl.setValue(null);
  }

  addK(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our supplier
    if ((value || '').trim()) {
      this.keywords.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.keywordsCtrl.setValue(null);
  }
  toggleAllSelection(groupIndex) {
    const selected = !this.allproductType[groupIndex].allSelected;
    this.allproductType[groupIndex].allSelected = selected;

    if (selected) {// if (this.allproductType[groupIndex].allSelected) {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        const f = this.allproductType[groupIndex].items.find(x => x.value === item.value);
        if (f) {
          item.select();
        }
      });
    } else {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        const f = this.allproductType[groupIndex].items.find(x => x.value === item.value);
        if (f) {
          item.deselect();
        }
      });
    }
    for (let i = 0; i < this.allproductType[groupIndex].items.length; i++) {
      this.toggleLevel2Selection(groupIndex, i, selected);
    }
  }
  toggleLevel2Selection(groupIndex, level2Index, parentSelected?: boolean) {
    let selected;
    if (typeof parentSelected !== 'undefined') {
      selected = parentSelected;
    }
    else {
      selected = !this.allproductType[groupIndex].items[level2Index].allSelected;
    }

    this.allproductType[groupIndex].items[level2Index].allSelected = selected;
    if (selected) {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        if (this.allproductType[groupIndex].items[level2Index].items.find(x => x.value === item.value)) {
          item.select();
        }
      });
    } else {
      this.selectedTypesSel.options.forEach((item: MatOption) => {
        // if (this.allproductType[groupIndex].items[level2Index].items.indexOf(item.value) > -1)
        if (this.allproductType[groupIndex].items[level2Index].items.find(x => x.value === item.value)) {
          item.deselect();
        }
      });
    }
  }


  inviteNew(): void {
    const ref = this.inviteDialog.open(InviteSupplierComponentComponent, {
      width: '600px',
      height: '590px',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      // data: { url: url },
    });
    ref.afterClosed().subscribe((result) => { });
  }

}


