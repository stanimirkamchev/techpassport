import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import {
  AssessmentService,
  IAssessmentsElement,
} from '@services/assesment/assessment.service'; // AssessmentComponentData
import {
  ProductElement,
} from '@services/product/product.service';

import { getData, getName } from 'country-list';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';

import { MatTabGroup } from '@angular/material/tabs';
import { ProjectService } from '@services/project/project.service';
import { MatTableDataSource } from '@angular/material/table';
import { Socket } from 'ngx-socket-io';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';

declare const html2pdf: any;
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
})
export class AssessmentComponent implements OnInit, OnDestroy {
  selectedAssesment: any;
  assessmentList$: Observable<any>;
  informationSecurity$: Observable<any>;
  productReview$: Observable<any>;

  displayedRRColumns = ['title', 'value'];
  downloadingPDF = false;
  riskReportData: any;
  index = 0;
  overallStatus = 0;
  selectedInput = null;
  uploadingFile = null;
  readOnly = false;
  product: ProductElement;
  guidancePage = false;
  public minDateEnd: Date = new Date();
  public onboardingChart = {
    chartOptions: {
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
      responsive: true,
      position: 'left',
      segmentShowStroke: false,
      legend: {
        position: 'bottom',
        align: 'center',
      },
    },
    segmentShowStroke: false,
    chartData: [0, 100],
    chartLabels: ['Complete', 'Not Complete'],
    chartColors: [
      {
        border: ['rgba(0, 175, 1, 1)'],
        backgroundColor: ['rgba(0, 175, 1, 1)', 'rgba(100, 100, 100, 0.6)'],
      },
    ], // 'rgba(250, 190, 10, 0.7)' , 'rgba(13, 27, 71, 0.7)' , 'rgba(54, 168, 225, 0.7)'
    chartType: 'pie', // polarArea
    chartLegend: false,
    chartPlugins: [],
  };
  public assessments = null;
  public supplierId: string;
  informationSecurityAssesment: any[] = [];
  informationSecurityFormArray = new FormArray([]);

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('horiziontalTabs', { static: true }) horiziontalTabs: MatTabGroup;
  @ViewChild('riskReportElement', { static: true })
  riskReportElement: ElementRef<HTMLInputElement>;

  getName = getName;
  getUnicodeFlagIcon = getUnicodeFlagIcon;

  private componentDestroyed$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<AssessmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiService: ApiService,
    private socket: Socket,
    public assessmentService: AssessmentService,
    public projectService: ProjectService,
    private ref: ChangeDetectorRef,
    private alertDialog: MatDialog
  ) {
    this.product = data;
    this.assessments = assessmentService.assessments;
    this.readOnly = data.readOnly;

    if (this.readOnly !== true) {
      this.socket.on('file-status', (event) => {
        if (!event.hash) { return; }

        for (const c of this.informationSecurityAssesment) {
          for (const q of c.questions) {
            if (event.hash === q.hash) {
              q.status = event.status;
              q.errorMessage = event.message;
              this.checkOverallProgress();
            }
          }
        }

        for (const assessment of this.assessments) {
          console.log('this.assessments', this.assessments);
          console.log('items', assessment.items);
          for (const item of assessment.items) {
            for (const item2 of item.items) {
              for (const component of item2.components) {
                if (event.hash === component.hash) {
                  component.status = event.status;
                  component.errorMessage = event.message;
                  this.checkOverallProgress();

                  return;
                }
              }
            }
          }
        }
      });
    }
    this.checkData();
  }

  ngOnInit() {
    this.productReview$ = this.apiService.adminGetProductReview(this.data.id);

    if (this.readOnly) {
      this.assessmentList$ = this.apiService
        .adminGetComplianceChecklist(this.data.supplier._id)
        .pipe(tap((list) => (this.selectedAssesment = list[0])));
      this.informationSecurity$ = this.apiService.adminGetComplianceInformationSecurity(
        this.data.supplier._id
      );
    }

    this.informationSecurityAssesment = this.assessmentService.informationSecurityAssesment;
    console.log('this.informationSecurityAssesment', this.informationSecurityAssesment);
    if (!this.readOnly && this.data.jumpToCategory) {
      this.changeIndex(this.data.jumpToCategory);
    }
    else if (!this.readOnly && !this.data.id) { this.changeIndex(2); }
    else if (this.readOnly && this.data.jumpToCategory) {
      this.changeTabIndex(this.data.jumpToCategory);
 }

    if (this.data.readOnly === true) {
      this.riskReportData = [];

      let ji = -1;
      const allCoutries = getData();
      for (const ind in this.projectService.questionsMap.supplier) {
        if (ind === 'company') { continue; }

        let title_cat;
        switch (ind) {
          case 'details':
            title_cat = 'Product Details';
            break;
          case 'licensing':
            title_cat = 'Licensing';
            break;
          case 'access':
            title_cat = 'Access';
            break;
          case 'charges':
            title_cat = 'Charges';
            break;
          case 'specialConditions':
            title_cat = 'Special Conditions';
            break;
          default:
            title_cat = ind;
            break;
        }
        ji++;
        this.riskReportData[ji] = { items: [], title: title_cat };

        for (const ind2 in this.projectService.questionsMap.supplier[ind]) {
          const q = this.projectService.questionsMap.supplier[ind][ind2];
          const a = this.data.details[ind][ind2];
          if (true || q.riskReport === true) {
            let title = '';
            let value = '';

            if (q.scheduleTitle && q.scheduleTitle.length > 0) {
              title = q.scheduleTitle;
            }
            else { title = q.question; }

            if (q.type === 'coutries') {
              for (let cc = 0; cc < a.length; cc++) {
                const c = a[cc];
                for (let ci = 0; ci < allCoutries.length; ci++) {
                  if (allCoutries[ci].code.toLowerCase() === c) {
                    if (value.length > 0) {
                      value += ', ';
                    }
                    value += allCoutries[ci].name;
                  }
                }
              }
            } else { value = a; }

            if (!value || value.length === 0) { value = 'N/A'; }

            if (title === 'N/A') { continue; }

            this.riskReportData[ji].items.push({
              title: q.id + ' ' + title,
              value,
              question: q.question,
            });
          }
        }
        this.riskReportData[ji].dataSource = new MatTableDataSource(
          this.riskReportData[ji].items
        );
      }
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  async checkData() {
    const a = await this.apiService.getAssesments(this.data.supplier?._id);
    a.subscribe(
      (data: HttpResponse<Object>) => {
        this.data.assessments = (data.body as any).assessments;
        this.data.securityQuestions = (data.body as any).securityQuestions;
        this.buildData();
      },
      (respError: Error) => { }
    );
  }
  buildData() {
    for (const productAssessment of this.data.assessments) {
      for (const assessment of this.assessments) {
        if (productAssessment.assessment === assessment.title) {
          for (const level of assessment.items) {
            if (level.title === productAssessment.category) {
              for (const level2 of level.items) {
                for (const component of level2.components) {
                  if (component.id === productAssessment.fieldId) {
                    component._id = productAssessment._id;
                    if (productAssessment.status) {
                      component.status = productAssessment.status;
                    } // "uploaded";
                    if (productAssessment.hash) {
                      component.hash = productAssessment.hash;
                    } // "uploaded";

                    if (
                      component.hasOwnProperty('validDate') &&
                      productAssessment.validDate
                    ) {
                      component.validDate = new Date(
                        productAssessment.validDate
                      );
                    }
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }

    //
    this.informationSecurityAssesment.forEach((section) => {
      const sectionArray = new FormArray([]);
      section.questions.forEach((question) => {
        const id = question.id;
        const db_question = this.data.securityQuestions.filter(
          (x) => x.id === id
        );

        let compliant = null;
        let answer = '';
        let evidenceDescription = '';

        if (db_question.length > 0) {
          compliant = db_question[0].compliant;
          answer = db_question[0].answer;
          evidenceDescription = db_question[0].evidenceDescription;

          question.status = db_question[0].status;
          question.hash = db_question[0].hash;
          question._id = db_question[0]._id;
        }

        const fg = new FormGroup({
          id: new FormControl(question.id),
          compliant: new FormControl(compliant),
          answer: new FormControl(answer),
          evidenceDescription: new FormControl(evidenceDescription),
        });

        sectionArray.push(fg);
        fg.valueChanges
          .pipe(takeUntil(this.componentDestroyed$))
          .pipe(throttleTime(400))
          .subscribe(async (e) => {
            const apiCall = this.apiService.addInformationSecurity(
              e.id,
              e.answer,
              e.compliant,
              e.evidenceDescription,
              this.data.supplier?._id
            );
            apiCall.subscribe(
              (data: HttpResponse<Object>) => {
                // handle
              },
              (respError: Error) => {
                // handle
              }
            );
          });
      });
      this.informationSecurityFormArray.push(sectionArray); ///
    });

    this.checkOverallProgress();
    this.checkProgress(0);
  }
  genPDF() {
    this.downloadingPDF = true;
    const options = {
      margin: 1,
      filename: `RiskReport_${this.product?.supplier.name}_${this.product?.name}.pdf`,
      jsPDF: {
        ientation: 'portrait',
        unit: 'cm',
        format: 'a4',
      },
    };
    const nativeElement = document.getElementById('riskReportElement');
    const _this = this;
    html2pdf()
      .set(options)
      .from(nativeElement)
      .save()
      .finally(() => {
        _this.downloadingPDF = false;
      });
  }
  exit() {
    this.dialogRef.close();
  }
  camelCase(str) {
    /// TO DO  - MOVE THAT TO UTILS !!!
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }
  openInfoSecFileInput(question) {
    this.selectedInput = { component: question, secInfo: true };
    this.fileInput.nativeElement.click();
    this.fileInput.nativeElement.value = null;
  }
  openFileInput(index, category, level, component) {
    let _globalId = category.title + level.title;
    if (level.components.length > 1) { _globalId += `_${component.id}`; }

    this.selectedInput = {
      index,
      category,
      level,
      component,
      baseLevel: this.assessments[index].baseLevel,
      fieldId: component.id,
      globalId: this.camelCase(_globalId),
    };
    this.fileInput.nativeElement.click();
    this.fileInput.nativeElement.value = null;
  }
  downloadTemplate(component) {
    const url = this.apiService.getTemplateURL(component.templateName);
    if (url === null) { return; }
    // document.write(`<meta http-equiv="refresh" content="5;url=${url}">`);
    const elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();

    window.focus();
  }
  removeAssesment(index, component) {
    this.apiService.removeAssesment(component._id).subscribe(
      (data: HttpResponse<Object>) => {
        if ((data.body as any).status === 'success') {
          component._id = null;
          component.status = null;
          component.hash = null;
          this.checkOverallProgress();
        }
      },
      (respError: Error) => {
        console.log('respError', respError);
      }
    );
  }
  downloadFile(component) {
    const url = this.apiService.getAssessmentsURL(component._id);
    if (url === null) { return; }
    // document.write(`<meta http-equiv="refresh" content="5;url=${url}">`);
    const elem = document.createElement('a');
    elem.href = url;
    elem.target = 'hiddenIframe';
    elem.click();
    window.focus();
    // window.open(url);
  }
  async onFileInputChange(event) {
    if (event.target.files && event.target.files[0]) {
      const ref = this.alertDialog.open(AlertModalComponent, {
        width: '360px',
        height: '180px',
        disableClose: true,
        data: {
          title: 'Upload in progress!',
          message: 'Please do not close this window until upload completes!',
          actions: [{ label: 'Close', color: 'primary' }],
          links: [],
          progress: true,
        },
      });
      let idProduct = null;
      if (this.selectedInput.secInfo === true) {
        this.selectedInput.component.uploadingFile = true;
        this.selectedInput.component.errorMessage = null;
        idProduct = this.product?.id;

        const apiCall = this.apiService.addInformationSecurityEvidence(
          this.selectedInput.component.id,
          event.target.files[0],
          this.data.supplier?._id
        );
        apiCall.subscribe(
          (data: HttpResponse<Object>) => {
            this.selectedInput.component.uploadingFile = false;
            this.selectedInput.component.status = (data.body as any).status; // "uploaded";
            this.selectedInput.component.hash = (data.body as any).hash; // "uploaded";
            this.selectedInput.component._id = (data.body as any)._id;
            //  this.checkProgress( this.selectedInput.index );
            //  this.checkOverallProgress();
            ref.close();
          },
          (respError: Error) => {
            this.selectedInput.component.uploadingFile = false;
            this.selectedInput.component.errorMessage = (respError as any).error.message;
            this.selectedInput.component.status = 'error';
            //    this.checkProgress( this.selectedInput.index);
            //    this.checkOverallProgress();
            ref.close();
          }
        );
      } else {
        this.selectedInput.component.uploadingFile = true;
        this.selectedInput.component.errorMessage = null;
        const baseLevel = this.selectedInput.baseLevel;
        if (this.selectedInput.baseLeve === 'product') {
          idProduct = this.product?.id;
        }

        const apiCall = this.apiService.addAssesment(
          baseLevel,
          event.target.files[0],
          this.selectedInput.globalId,
          this.selectedInput.fieldId,
          this.assessments[this.selectedInput.index].title,
          this.selectedInput.category.title,
          this.selectedInput.level.title,
          this.data.supplier?._id
        );
        apiCall.subscribe(
          (data: HttpResponse<Object>) => {
            this.selectedInput.component.uploadingFile = false;
            this.selectedInput.component.status = (data.body as any).status; // "uploaded";
            this.selectedInput.component.hash = (data.body as any).hash; // "uploaded";
            this.selectedInput.component._id = (data.body as any)._id;
            // this.checkProgress( this.selectedInput.index );
            this.checkOverallProgress();
            ref.close();
          },
          (respError: Error) => {
            this.selectedInput.component.uploadingFile = false;
            this.selectedInput.component.errorMessage = (respError as any).error.message;
            this.selectedInput.component.status = 'error';
            // this.checkProgress( this.selectedInput.index);
            this.checkOverallProgress();
            ref.close();
          }
        );
      }
    }
  }
  async validDateChanged(event, component, level1, index) {
    const baseLevel = this.assessments[index].baseLevel;
    const apiCall = this.apiService.addAssesmentValidDate(
      baseLevel,
      component.id,
      this.assessments[index].title,
      level1.title,
      component.validDate.toISOString(),
      this.data.supplier?._id
    );
    apiCall.subscribe(
      (data: HttpResponse<Object>) => {
        component._id = (data.body as any)._id;
        // this.checkProgress( index );
        this.checkOverallProgress();
      },
      (respError: Error) => {
        // this.checkProgress(index);
        this.checkOverallProgress();
      }
    );
  }
  checkOverallProgress() {
    let total = 0;
    let completed = 0;
    for (let index = 0; index < this.assessments.length; index++) {
      const p = this.checkProgress(index);
      total += p.total;
      completed += p.completed;
    }
    this.overallStatus = Math.round((100 * completed) / total);
  }

  checkProgress(assIndex) {
    const assesment = this.assessments[assIndex];
    let total = 0;
    let completed = 0;

    if (assIndex === 0) {
      for (const category of this.informationSecurityAssesment) {
        total += category.questions.length;
        for (let i = 0; i < category.questions.length; i++) {
          if (category.questions[i].status === 'allowed') { completed++; }
        }
      }
    } else {
      for (const category of assesment.items) {
        for (let i = 0; i < category.items.length; i++) {
          total += category.items[i].components.length;
          for (let j = 0; j < category.items[i].components.length; j++) {
            if (
              (category.items[i].components[j] as IAssessmentsElement).status ===
              'allowed'
            ) {
              completed++;
            }
            if (
              (category.items[i].components[
                j
              ] as IAssessmentsElement).hasOwnProperty('validDate')
            ) {
              total++;
              if (
                (category.items[i].components[j] as IAssessmentsElement)
                  .validDate !== null
              ) {
                completed++;
              }
            }
          }
        }
      }
    }
    assesment.progress = Math.round((100 * completed) / total);
    this.onboardingChart.chartData = [
      assesment.progress,
      100 - assesment.progress,
    ];

    return { completed, total };
  }

  getInsuranceVal(certType) {
    return this.data?.insurance?.find(x => x.certType === certType)?.value;
  }
  getInsuranceDate(certType) {
    return this.data.insurance?.find(x => x.certType === certType)?.validDate;
  }

  changeIndex(index: number) {
    this.index = index;
    this.guidancePage = false;
    this.checkProgress(index);
  }
  changeTabIndex(index: number) {
    this.horiziontalTabs.selectedIndex = index;
  }

  guidance() {
    this.guidancePage = true;
  }
  goBack() {
    this.guidancePage = false;
  }
  getVidUrl(prod) {
    return `/api/v1/product/${prod.id}/video/frame`;
  }
}
