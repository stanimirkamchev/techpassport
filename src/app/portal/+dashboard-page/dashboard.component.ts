import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

// Services
import { ApiService } from '@services/api/api.service';
import { ActivityElement, ProductElement } from '@services/product/product.service';
import { AssessmentService } from '@services/assesment/assessment.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';

// Shared Imports
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { UploadModalComponent } from '@shared/modals/upload-modal/upload-modal.component';

import * as _ from 'underscore';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '@shared/page-service';
import { TextConstants } from "@shared/text-constants";

type Equation = { completed: number, compliant: number };
type ProgressBar = { [key: string]: Equation };

export interface CompanyElement {
  id: string;
  name: string;
  membership: string;
  status: string;
}

export interface AnalyticsElement {
  searches: number;
  viewed: number;
  compliance: number;
  poc: number;
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardPageComponent implements OnInit {
  public progressBar: ProgressBar = {
    total: {
      completed: 0,
      compliant: 0
    }
  };
  public onboardingChart = {
    chartOptions: {
      scale: {
        // reverse: false,
        ticks: {
          min: 0,
          max: 100
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        position: 'right',
        align: 'center'
      },
    },
    chartData: [0, 0, 0, 0, 0],
    chartLabels: [
      'Supplier',
      'Insurance',
      'Product',
      'Team',
      'Compliance Checklist'],
    chartColors: [{
      backgroundColor: [
        'rgba(95, 117, 207, 0.65)',
        'rgba(250, 190, 10, 0.65)',
        'rgba(13, 27, 71, 0.65)',
        'rgba(54, 168, 225, 0.65)',
        'rgba(220, 78, 75, 0.65)']
    }],
    chartType: 'polarArea', // polarArea
    chartLegend: true,
    chartPlugins: []
  };
  public assesmentChart = {
    chartOptions: {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 10,
            precision: 1,
            suggestedMin: 100,
            suggestedMax: 100
          }
        }]
      },
      responsive: true,
      onClick: this.onAssesmetChartClick(),
      // onHover:function(e,i){ console.log("e",e);},
      maintainAspectRatio: false,
      // position: 'left',
      legend: {
        itemclick(e) {
          // alert( "Legend item clicked with type : " + e.dataSeries.type);
        },
        onClick(e, i) { },
        onHover(e, i) { },
        position: 'bottom',
        align: 'center'
      }
    },
    chartData: [], // [1,30,0,0,0,0,0,0,0,0,0,0,100],
    chartLabels: [],
    chartColors: [{
      backgroundColor: [
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)',
        'rgba(0, 175, 1, 1)'
      ]
    }],
    chartType: 'horizontalBar', // polarArea
    chartLegend: false,
    chartPlugins: []
  };

  public overallStatusTotal = 0;
  public overallStatusItems = 0;

  public overallProductsTotal = 0;
  public overallProductsItems = 0;

  public overallStatus = 40;
  public assessmentTotal = 0;

  public assessmentComplete = 0;
  public overallChecklistStatus = 0;

  public productDisplayedColumns: string[] = ['name', 'status', 'actions'];
  public activityDisplayedColumns: string[] = ['scope', 'message', 'object', 'date']; // 'object' //'scope',
  private productData: ProductElement[] = [];
  private activityData: ActivityElement[] = [];
  private activityDataNoProduct: ActivityElement[] = [];
  private activityDataConnects: ActivityElement[] = [];
  public productsDataSource = new MatTableDataSource(this.productData);
  public activityDataSource = new MatTableDataSource(this.activityData);
  public supplierDetails: CompanyElement;
  public selectedProduct: ProductElement;
// KUBA
  public productName: string;
  public supplierName = '';
  public selectedProd = false;
  public stamp = { compilance: '', membership: 'core', video: 'n/a', videoName: 'n/a', useCase: 'n/a', insurance: [] };
  public isSupplierStarted = false;
  public addDetailsMessage = TextConstants.YouNeedToAddDetailsToYourProfileToAddProducts;
  private initialProductMessage = 'No product selected';

  private statusEnum = [
    { status: 'Draft', label: 'Draft', class: 'draft' },
    { status: 'Created', label: 'In Review', class: 'review' },
    { status: 'SentForApproval', label: 'In Review', class: 'review' },
    { status: 'Approved', label: 'Approved', class: 'complete' },
    { status: 'Rejected', label: 'Rejected', class: 'reject' }
  ];
  public analytics: AnalyticsElement = {
    searches: 0,
    viewed: 0,
    compliance: 0,
    poc: 0
  };


  constructor(
    private pageService: PageService,
    private apiService: ApiService,
    private assessmentService: AssessmentService,
    private eventEmitterService: EventEmitterService,
    private socket: Socket,
    private uploadDialog: MatDialog,
    private alertDialog: MatDialog,
    public router: Router,
    private route: ActivatedRoute,
  ) {

    this.productName = this.initialProductMessage;
    this.getSupplierStatus();
    this.getSupplierDetails();
    this.getSupplierActicity();
    this.getProducts();
    this.getSupplierStamps();
    this.getSupplierTeam();
    this.getAnalytics();


    this.socket.on('new-product', (event) => {
      this.getProducts();
    });

    this.socket.on('assessment', (event) => {
      this.getProducts();
    });

    this.socket.on('connectMe', (event) => {
      this.getSupplierActicity();
      this.getProducts();
    });


  }
  ngOnInit() {
  }

  onChangeProgressBar(progressBar: ProgressBar) {
    this.progressBar = progressBar;
  }

  onAssesmetChartClick() {
    const _this = this;
    return (e, item) => {
      let product;
      try {
        if (_this.selectedProduct) {
          product = _this.selectedProduct;
        }
        else {
          product = _this.productData[0];
        }

        const lab = item[0]._model.label;
        let i = 0;

        if (lab) {
          for (i = 0; i < _this.assesmentChart.chartLabels.length; i++) {
            if (_this.assesmentChart.chartLabels[i] === lab) {
              _this.assessment(product, i);
              return;
            }
          }
        }
      } catch (error) {
        console.log('errer', error);
      }
      _this.assessment(product);
    };
  }

  applyProductFilter(filterValue: string) {
    this.productsDataSource.filter = filterValue.trim().toLowerCase();
  }
  applyActivityFilter(filterValue: string) {
    this.activityDataSource.filter = filterValue.trim().toLowerCase();
  }
  addProduct() {
    this.eventEmitterService.onProductOnboad(null);
  }
  editProduct(product: ProductElement) {
    this.eventEmitterService.onProductOnboad(product);
  }
  removeProduct(product: ProductElement) {
    // this.eventEmitterService.onProductOnboad(product);
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '330px',
      height: '240px',
      disableClose: true,
      data: {
        title: '', message: `Are you sure you want to remove ${product.name}?`,
        links: null,
        actions: [{ label: 'Yes', color: 'warn' }, { label: 'No', color: 'primary' }]
      }
    });

    ref.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        this.apiService.removeProduct(product.id)
          .subscribe(
            (data: HttpResponse<Object>) => {
              this.getProducts();
            },
            (respError: Error) => {

            });
      } else if (result === 'No') {

      }
    });

  }

  sendToReview(product: ProductElement) {
    this.apiService.sendProductToreview(product.id).subscribe((data: HttpResponse<Object>) => {
      const status = this.statusEnum.find(x => x.status === (data.body as any).status);
      if (!status) {
        return;
      }
      product.status = status.label;
      product.class = status.class;
    }, (respError: Error) => { });
  }
  assessment(product?: ProductElement, category?: number) {
    // IF PRODUCTS.LENGTH === 0 > GET FIRST OME
    this.eventEmitterService.onAssesment(product, category, false);
  }
  assesmentBt() {
    let product;
    try {
      if (this.selectedProduct) {
        product = this.selectedProduct;
      }
      else {
        product = this.productData[0];
      }

      this.assessment(product);
      return;


    } catch (error) {
      console.log('errer', error);
    }
    this.assessment();
  }
  getSupplierStamps(productID?: string) {
    this.apiService.getSupplierStamps(productID)
      .subscribe(
        (data: HttpResponse<Object>) => {
          this.stamp = data.body as any;
        },
        (respError: Error) => {

        });
  }
  getSupplierActicity() {
    this.apiService.getSupplierActicity()
      .subscribe((data: HttpResponse<Object>) => {
        this.activityDataConnects = data.body as any;
        this.activityData = this.activityDataNoProduct.concat(this.activityDataConnects);
        this.activityData = _.sortBy(this.activityData, 'timestamp').reverse();
      }, (respError: Error) => {

      });
  }
  getSupplierDetails() {
    this.apiService.getSupplierDetails()
      .subscribe((data: HttpResponse<Object>) => {
        this.supplierDetails = {
          id: (data.body as any).id,
          name: (data.body as any).name,
          membership: (data.body as any).membership,
          status: (data.body as any).status
        };
        this.supplierName = this.supplierDetails.name;
        const activityElement: ActivityElement = {
          position: 1,
          date: new Date((data.body as any).createdAt), // .toLocaleString(),
          timestamp: new Date((data.body as any).createdAt).getTime(),
          message: `Company Onboarded`,
          class: 'accent',
          scope: 'Company',
          object: (data.body as any).name
        };
        this.activityData.push(activityElement);
        this.activityDataNoProduct.push(activityElement);

        let overallSupplierStatus = 0;
        let overallSupplierStatusTotal = 9; // Questions
        overallSupplierStatusTotal++; //  TERMS
        overallSupplierStatusTotal++; //  LOGO
        overallSupplierStatusTotal++; //  ABOUT

        let overallInsuranceStatus = 0;
        const overallInsuranceStatusTotal = 2;

        this.overallStatusTotal += overallSupplierStatusTotal;
        this.overallStatusTotal += overallInsuranceStatusTotal;

        if ((data.body as any).name && (data.body as any).name.length > 0) {
          overallSupplierStatus++;
        }
        if ((data.body as any).country && (data.body as any).country.length > 0) {
          overallSupplierStatus++;
        }
        if ((data.body as any).companyNumber && (data.body as any).companyNumber.length > 0) {
          overallSupplierStatus++;
        }
        if ((data.body as any).address1 && (data.body as any).address1.length > 0) {
          overallSupplierStatus++;
        }
        if ((data.body as any).city && (data.body as any).city.length > 0) {
          overallSupplierStatus++;
        }
        if ((data.body as any).postcode && (data.body as any).postcode.length > 0) {
          overallSupplierStatus++;
        }
        if ((data.body as any).membership && (data.body as any).membership.length > 0) {
          overallSupplierStatus++;
        }

        // terms & conditions AS must be accepted
        overallSupplierStatus++;

        // AUDIT!!!!
        overallSupplierStatus += 2;


        if ((data.body as any).about && (data.body as any).about.length > 0) {
          overallSupplierStatus++;
        }

        if ((data.body as any).logo && (data.body as any).logo.length > 0) {
          overallSupplierStatus++;
        }


        if ((data.body as any).insurance === true) {
          overallInsuranceStatus++;

          // IF NO CERT !!!!
          /* let insuranceActivity : ActivityElement =  {
               position: 1,
               date: new Date().toLocaleString(),
               timestamp:  new Date().getTime(),
               message: `Please upload your insurance certificate!`,
               class: 'warn',
               object: "Insurance"
           };


           this.activityData.push(insuranceActivity);
           this.activityDataNoProduct.push(insuranceActivity);*/
        } else {
          // const insuranceActivity2: ActivityElement = {
          //   position: 1,
          //   date: new Date(), // .toLocaleString(),
          //   timestamp: new Date().getTime(),
          //   message: `We recommend you upload your insurance certificates.`,
          //   class: 'warn',
          //   scope: 'Company',
          //   object: 'Insurance'
          // };
          //
          //
          // this.activityData.push(insuranceActivity2);
          // this.activityDataNoProduct.push(insuranceActivity2);
        }

        // TO DO check insurance file

        this.onboardingChart.chartData = [
          Math.round((100 * overallSupplierStatus) / overallSupplierStatusTotal),
          Math.round((100 * overallInsuranceStatus) / overallInsuranceStatusTotal),
          this.onboardingChart.chartData[2],
          this.onboardingChart.chartData[3],
          this.onboardingChart.chartData[4]
        ];


        this.overallStatusItems += overallSupplierStatus;
        this.overallStatusItems += overallInsuranceStatusTotal;

        // this.overallStatus = Math.round( (this.overallStatusTotal * this.overallStatusItems)/100 );

        this.activityData = _.sortBy(this.activityData, 'timestamp').reverse();
        this.activityDataSource = new MatTableDataSource(this.activityData);


      }, (respError: Error) => {

      });
  }
  getSupplierTeam() {
    this.apiService.getSupplierTeam()
      .subscribe((data: HttpResponse<Object>) => {
        //  this.team = data.body as any;
        let overallTeamStatus = 0;
        this.overallStatusTotal += 2;

        if ((data.body as any).length === 1) {
          overallTeamStatus = 50;
          this.overallStatusItems++;
        }

        if ((data.body as any).length > 1) {
          overallTeamStatus = 100;
          this.overallStatusItems++;
        }

        this.onboardingChart.chartData = [
          this.onboardingChart.chartData[0],
          this.onboardingChart.chartData[1],
          this.onboardingChart.chartData[2],
          overallTeamStatus,
          this.onboardingChart.chartData[4]
        ];

      }, (respError: Error) => {
        // console.log("getSupplierTeam error", respError);
      });
  }
  getAnalytics() {
    this.apiService.getAnalytics()
      .subscribe((data: HttpResponse<Object>) => {

        this.analytics = data.body as AnalyticsElement;
      }, (respError: Error) => {
        // console.log("getSupplierTeam error", respError);
      });
  }

  getSupplierStatus() {
    this.apiService.getSupplierStatus().subscribe(data => {
      if (data.body.status === 'started') {
        this.isSupplierStarted = true;
        // this.router.navigate([], {
        //   queryParams: { page: 'onboarding', onboardingPage: 'profile-start' },
        //   queryParamsHandling: 'merge',
        //   relativeTo: this.route
        // });
      }
    });
  }

  getProducts() {
    this.apiService.getProducts()
      .subscribe((data: HttpResponse<any>) => {
        const products = data.body as Array<any>;
        this.productData = [];
        this.activityData = this.activityDataNoProduct.slice().concat(this.activityDataConnects);

        this.overallProductsTotal = 0;
        this.overallProductsItems = 0;

        for (const p of products) {
          this.overallProductsTotal += 55; // DEV
          let status = this.getLastStatusByProduct((p as any).status);
          let statusClass;

          this.overallProductsItems += (p as any).answers;

          for (let i = 0; i < this.statusEnum.length; i++) {
            if (this.statusEnum[i].status === status) {
              status = this.statusEnum[i].label;
              statusClass = this.statusEnum[i].class;
              break;
            }
          }

          const productElement: ProductElement = {
            position: this.productsDataSource.filteredData.length + 1,
            id: (p as any)._id, name: (p as any).name,
            assessments: (p as any).assessments,
            securityQuestions: (p as any).securityQuestions,
            statusHistory: (p as any).status,
            status, // "In Review",
            class: statusClass,
            actions: ''
          };

          const activityElement: ActivityElement = {
            position: this.activityDataSource.filteredData.length + 1,
            date: new Date((p as any).createdAt), // .toLocaleString(),
            timestamp: new Date((p as any).createdAt).getTime(),
            message: 'You have added new product!', // `New Product`,
            scope: 'Product',
            class: 'accent',
            object: (p as any).name
          };

          this.productData.push(productElement);
          this.activityData.push(activityElement);
          this.buildAssesmentsChart(null);
        }

        this.activityData = _.sortBy(this.activityData, 'timestamp').reverse();
        this.productsDataSource = new MatTableDataSource(this.productData);
        this.activityDataSource = new MatTableDataSource(this.activityData);


        const overallProdStatus = Math.round((100 * this.overallProductsItems) / this.overallProductsTotal);
        this.onboardingChart.chartData = [
          this.onboardingChart.chartData[0],
          this.onboardingChart.chartData[1],
          overallProdStatus,
          this.onboardingChart.chartData[3],
          this.onboardingChart.chartData[4],
        ];

      }, (respError: Error) => {

      });
  }
  buildAssesmentsChart(onlyForProductId: string) {
    this.assesmentChart.chartLabels = [];
    this.assesmentChart.chartData = [];
    this.overallStatusItems++;
    const assessmentTotal = 89; //
    let assessmentComplete = 0;
    const productElement = this.productData[0];
    // assessmentTotal     += this.assessmentService.assesmentsTotalCount;
    for (let i = 0; i < productElement.assessments.length; i++) {
      if (productElement.assessments[i].validDate && productElement.assessments[i].validDate.length > 0) {
        assessmentComplete++;
      }
      if (productElement.assessments[i].status === 'allowed') {
        assessmentComplete++;
      }
    }

    let securityQuestionsCount = 0;
    for (let i = 0; i < productElement.securityQuestions.length; i++) {
      if (productElement.securityQuestions[i].status === 'allowed') {
        assessmentComplete++;
        securityQuestionsCount++;
      }
    }

    for (let i = 0; i < this.assessmentService.assessmentLevelTotal.length; i++) {
      let progress = 0;
      let total = 0;
      const level = this.assessmentService.assessmentLevelTotal[i];


      if (i === 0) {
        progress = securityQuestionsCount;
        total = this.assessmentService.questionsTotal;

      } else {
        total += level.total;
        for (const pa of productElement.assessments) {
          if (pa.assessment === level.title) {
            if (pa.validDate) {
              progress++;
            }
            if (pa.file) {
              progress++;
            }
          }
        }

      }
      this.assesmentChart.chartLabels.push(level.title);
      this.assesmentChart.chartData.push(Math.round((100 * progress) / total));
    }
    this.overallChecklistStatus = Math.round((100 * assessmentComplete) / assessmentTotal); /// TO DO FIX IT
    this.onboardingChart.chartData = [
      this.onboardingChart.chartData[0],
      this.onboardingChart.chartData[1],
      this.onboardingChart.chartData[2],
      this.onboardingChart.chartData[3],
      this.overallChecklistStatus
    ];


    this.assessmentTotal = assessmentTotal;
    this.assessmentComplete = assessmentComplete;
    // this.overallStatusTotal += assessmentTotal;
    // this.overallStatusItems += assessmentComplete;

    // this.overallStatus = Math.round( (this.overallStatusTotal * this.overallStatusItems)/100 );

    //  this.overallChecklistStatus;

  }
  checkProgress() {
    //

  }

  getOverallStatus() {
    // console.log(" this.overallProductsItems", this.overallProductsItems);
    // console.log(" this.overallProductsTotal", this.overallProductsTotal);
    return Math.round((100 * (this.overallStatusItems + this.assessmentComplete + this.overallProductsItems)) / (this.overallStatusTotal + this.assessmentTotal + this.overallProductsTotal));

  }

  selectProduct(raw) {
    console.log('selectProduct', raw);
    if (this.selectedProduct && this.selectedProduct.id === raw.id) {
      this.selectedProd = false;
      this.productName = this.initialProductMessage;
      this.selectedProduct = null;
      this.buildAssesmentsChart(null);
      this.getSupplierStamps();
    } else {
      this.selectedProd = true;
      this.selectedProduct = raw;
      this.buildAssesmentsChart(this.selectedProduct.id);
      this.productName = this.selectedProduct.name;
      this.getSupplierStamps(this.selectedProduct.id);
    }

  }

  editVideo(edit: boolean, name) {
    const ref = this.uploadDialog.open(UploadModalComponent, {
      width: '70vw',
      height: '84vh',
      disableClose: true,
      data: { type: 'mov', name, disableActions: true, productId: this.selectedProduct.id, edit, supplierId: null }
    });
    ref.afterClosed().subscribe(result => {
      // if (this.detailsFormGroup.name)
    });
  }

  activityAction(item: ActivityElement) {
    if (item.connection === true) {
      this.eventEmitterService.onChangePage('poc');
    }

  }

  onERQButtonClicked() {
    this.pageService.emitValue('erq');
    // TODO: emit flag
    // this.router.navigate(['enterprise-ready-questions']);
  }

  getLastStatusByProduct(productStatuses: any) {
    const status = productStatuses.sort((a: any, b: any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    return status[status.length - 1].status;
  }
}
