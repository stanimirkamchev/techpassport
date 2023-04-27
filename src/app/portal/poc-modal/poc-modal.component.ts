import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { AlertModalPocComponent } from '@shared/modals/alert-modal-poc/alert-modal-poc.component';
import { ApiService } from '@services/api/api.service';
import { ProjectService } from '@services/project/project.service';
import { HttpResponse } from '@angular/common/http';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  MockPocDataProducts,
  MockPocDataSuppliers,
  MockPocDataUsers,
  MockProjects,
  Product,
  Supplier,
  User
} from './poc-mock-data';
import { getData } from 'country-list';

import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import * as moment from 'moment';

export interface Step {
  validatorID: number;
  show: boolean;
  name: string;
  questionNR: string;
}
export interface PocModalData {
  id: string;
  productData?: any;
  projectName: string;
  handshakeID: string;
  step?: number;
}


@Component({
  selector: 'app-poc-modal',
  templateUrl: './poc-modal.component.html',
  styleUrls: ['./poc-modal.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: false }
  }]
})
export class PocModalComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper; // ElementRef<MatStepper>;

  public initialaizingPOC = false;
  public projectName = '';
  public productName = '';
  public POCdb: any;
  public minDateStart = new Date();
  public maxDateStart = null;
  public minDateEnd: Date = new Date();
  public maxDateEnd: Date = null;
  public tl = null;

  private endTime: Date;
  public pickerTimeEnd = false; // show fields
  public messageError = ' ';
  public choosenUserMail = [];
  public newUsersList = [];
  public currentStep = 0;
  public questionsFromPocExel = '';
  public suppliers: Supplier[] = MockPocDataSuppliers;
  public products: Product[] = MockPocDataProducts;
  public users: User[] = MockPocDataUsers.sort((a, b) => (a.first > b.first ? 1 : ((b.first > a.first) ? -1 : 0)));
  public projects: Array<string> = MockProjects.sort();
  public namesCreateProject: string[] = ['Rebbeca Black', 'Jonathan Victor Jr', 'Vicky Jonnats'];
  public trailFee: number;
  public maxUsersLimit: number; // number of users
  public additionalRestrictions: string; // ref_2_10
  public specialConditionsList: string;
  public leadTime = 0;  // ref 2_15
  public maxCopiesLimit = 0; // ref_2_8_c
  public testEnviroment: string; // ref_2_11
  public softwareLicence: string; // ref_2_8_a
  public hostedLiveSolution: string; // ref_2_11_a
  public includedTerritories = []; // ref_2_9_b
  public personalDataTransferMeasures; // ref_2_16;
  public testingAccess; // ref_2_26
  public liveAccess;
  public personalDataLocations;
  public hostingDescritpionList;
  public productDetailDescription;
  public documentationDescription;
  public additionalServicesDescription;
  public DesignatedLocations = []; // ??
  public bankEntityList: string[] = ['ABC International', 'IT Commercial Group'];
  public createProjectFormGroup: FormGroup;
  public bankEntityFormGroup: FormGroup;
  public projectIDFormGroup: FormGroup;
  public teamContactFormGroup: FormGroup;
  public chooseSupplierFormGroup: FormGroup;
  public solutionSuccessfulFormGroup: FormGroup;
  public trailFeeFormGroup: FormGroup;
  public specialConditionsFormGroup: FormGroup;
  public timeTrialFormGroup: FormGroup;
  public howManyUsersFormGroup: FormGroup;
  public testSystemFormGroup: FormGroup;
  public howManyCopiesFormGroup: FormGroup;
  public acceptHostingFormGroup: FormGroup;
  public selectTerritoriesFormGroup: FormGroup;
  public additionaLicenceFormGroup: FormGroup;
  public provisionSoftwareFormGroup: FormGroup;
  public dataTrialFormGroup: FormGroup;
  public requireAccessFormGroup: FormGroup;
  public requireAccess2FormGroup: FormGroup;
  public requireAccessLiveFormGroup: FormGroup;
  public providedLocationFormGroup: FormGroup;
  public dataClassificationFormGroup: FormGroup;
  public dataClassificationLiveFormGroup: FormGroup; // PK
  public outsideEEAFormGroup: FormGroup;
  public technicalOperationFormGroup: FormGroup;
  public additionalConditionsFormGroup: FormGroup;
  public customerEntityFormGroup: FormGroup;
  public projectRequirementsFormGroup: FormGroup;
  public filteredProjects: Observable<string[]>;
  public filteredSuppliers: Observable<Supplier[]>;
  public filteredProducts: Observable<Product[]>;
  public filteredUsers: Observable<User[]>;
  public allowComments = false;
  public allowUseCases = false;
  public listStep = {
    createProject: { validatorID: 24, show: false, name: 'createProject', questionNR: 'additonal' },
    projectRequirements: { validatorID: 25, show: false, name: 'projectRequirements', questionNR: 'additonal1' },
    /// yes
    welcome: { validatorID: 0, show: true, name: 'welcome', questionNR: '1' },
    /// no
    bankEntity: { validatorID: 1, show: false, name: 'bankEntity', questionNR: '2' },                                        // TRUE TO DO
    projectID: { validatorID: 2, show: false, name: 'projectID', questionNR: '3' },
    teamContact: { validatorID: 3, show: false, name: 'teamContact', questionNR: '4' },                                         // TRUE TO DO
    chooseSupplier: { validatorID: 4, show: false, name: 'chooseSupplier', questionNR: '5-6' },
    solutionSuccessful: { validatorID: 5, show: false, name: 'solutionSuccessful', questionNR: '7' },
    /// yes
    trailFee: { validatorID: 6, show: false, name: 'trailFee', questionNR: '8' },
    /// no
    specialConditions: { validatorID: 7, show: false, name: 'specialConditions', questionNR: '9' }, // if ref 2_20 is true
    /// yes
    timeTrial: { validatorID: 8, show: true, name: 'timeTrial', questionNR: '10-11' },
    howManyCopies: { validatorID: 11, show: false, name: 'howManyCopies', questionNR: '14' }, // this.ref_2_8_a&&!this.ref_2_11
    howManyUsers: { validatorID: 9, show: false, name: 'howManyUsers', questionNR: '12' }, // if ref_2_7 true,
    testSystem: { validatorID: 10, show: false, name: 'testSystem', questionNR: '13' },
    /// no
    customerEntity: { validatorID: 10, show: false, name: 'customerEntity', questionNR: '12a-12d' },
    acceptHosting: { validatorID: 12, show: false, name: 'acceptHosting', questionNR: '15' }, // after data Trail to real (?)
    selectTerritories: { validatorID: 13, show: false, name: 'selectTerritories', questionNR: '16' },
    additionaLicence: { validatorID: 14, show: false, name: 'additionaLicence', questionNR: '17' },
    provisionSoftware: { validatorID: 15, show: false, name: 'provisionSoftware', questionNR: '18' },
    requireAccess1: { validatorID: 16, show: false, name: 'requireAccess1', questionNR: '19' },
    requireAccess2: { validatorID: 17, show: false, name: 'requireAccess2', questionNR: '20' },
    providedLocation: { validatorID: 18, show: false, name: 'providedLocation', questionNR: '21-21a' },
    dataClassification: { validator: 19, show: false, name: 'dataClassification', questionNR: '22-23' },
    dataTrial: { validator: 20, show: false, name: 'dataTrial', questionNR: '24' },
    outsideEEA: { validator: 21, show: false, name: 'outsideEEA', questionNR: '25' },
    technicalOperation: { validator: 22, show: false, name: 'technicalOperation', questionNR: '26' },
    // yes
    additionalConditions: { validator: 23, show: false, name: 'additionalConditions', questionNR: '27-28' },
    POCend: { validator: 24, show: true, name: 'POCend', questionNR: 'end' },
  };
  public arryCond = {
    createProject: false,
    createProject1: false,
    createProject2: false,
    createProject3: false,
    createProject4: false,
    createProject5: false,
    createProject6: false,
    createProject7: false,
    createProject8: false,
    createProject9: false,
    createProject10: false,
    fieldProduct: false,
    fieldTestSystem1: false,
    fieldConditionsEdytor: false,
    fieldAddConditions: false,
    fieldEnterId: false,
    fieldTrailFee: false,
    addNewUser: false,
    customerEntity2: false,
    serviceEnvironment: false,
    additionaLicence1: false,
    provisionSoftware1: false,
    requireAccess1: false,
    requireAccess21: false,
    technicalOperation1: false,
    statusPocSummary: false,
    teamManager: false,
    chexboxFieldProduct: true,
    projectRequirements: false,
    projectRequirements2: false,
    systemTestReal: false,
    enterLocation: false,
    enterEEA: false
  };

  private alreadyAnswered = {};

  public trialFeeNegotiable: boolean;
  // MOC DATA FROM SERVER
  constructor(
    private dialogRef: MatDialogRef<PocModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PocModalData,
    private alertDialog: MatDialog,
    private fb: FormBuilder,
    private apiService: ApiService,
    public eventEmitterService: EventEmitterService,
    private projectService: ProjectService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.trialFeeNegotiable = this.projectService.questionsMap.supplier.charges.chargesAmtFee.negotiable;
    this.bankEntityFormGroup = fb.group({
      value: new FormControl('bank1', Validators.required)
    });
    this.createProjectFormGroup = fb.group({
      isExising: new FormControl(null, Validators.required),
      linkedProject: new FormControl(null),
      projectTitle: new FormControl(null),
      isRefProjectID: new FormControl(null),
      refProjectID: new FormControl(null),
      mainContact: new FormControl(null),
      mainContatName: new FormControl(null),
      selectMainContact: new FormControl(null),
      cantFindMainContact: new FormControl(null),
      addressNotice: new FormControl(null)
    });
    this.projectRequirementsFormGroup = fb.group({
      // projectRequirements: new FormControl(null, Validators.required),
      useCase: new FormControl('', Validators.required),
      assesmentCriteria: new FormControl('', Validators.required)
    });
    this.projectIDFormGroup = fb.group({
      projectID: new FormControl(null, Validators.required),
      enterProjectID: new FormControl(null),
    });
    this.teamContactFormGroup = fb.group({
      userList: new FormControl(null, Validators.email),
      newEMail: new FormControl('', [Validators.email, Validators.min(3)]),
      newLevel: new FormControl('Level 1'),
      newEntity: new FormControl('Entity 1'),
      newRegion: new FormControl('Region 1'),
      newBusiness: new FormControl('Buisness 1'),
      ruleCompany: new FormControl(null)
    });
    this.chooseSupplierFormGroup = fb.group({
      supplierListPoc: new FormControl(null, Validators.required),
      productListPoc: new FormControl(null, Validators.required)
    });
    this.solutionSuccessfulFormGroup = fb.group({
      value: new FormControl(null, Validators.required)
    });
    this.trailFeeFormGroup = fb.group({
      trailFee: new FormControl(null, Validators.required), //    trailFee
      trailFeeAmt: new FormControl({ value: 0, disabled: false }, Validators.required),
      trailFeeComment: new FormControl({ value: null, disabled: false })
    });

    this.specialConditionsFormGroup = fb.group({
      specialConditions: new FormControl(null, Validators.required),
      sepcialConditionsEdytor: new FormControl(this.specialConditionsList),
      specialConditionsText: new FormControl() // ?
    });

    const defaultStartDate = new Date();
    const defaultEndDate = new Date(defaultStartDate.setDate(defaultStartDate.getDate() + 90));

    this.timeTrialFormGroup = fb.group({
      startDateTrial: new FormControl(new Date(), Validators.required),
      endDateTrial: new FormControl(defaultEndDate, Validators.required)
    });

    this.howManyUsersFormGroup = fb.group({
      howManyUsers: new FormControl(null, Validators.required)
    });
    this.testSystemFormGroup = fb.group({
      testSystem: new FormControl(null, Validators.required),
      testingEnv: new FormControl(null)
    });
    this.howManyCopiesFormGroup = fb.group({
      howManyCopies: new FormControl(null, Validators.required)
    });
    this.customerEntityFormGroup = fb.group({
      customerEntity: new FormControl(null, Validators.required),
      name: new FormControl(null),
      registredNumber: new FormControl(null),
      registredAddress: new FormControl(null)
    });
    this.acceptHostingFormGroup = fb.group({
      acceptHosting: new FormControl(null, Validators.required),
      enterAcceptHosting: new FormControl(null)
    });
    this.selectTerritoriesFormGroup = fb.group({
      countries: new FormControl(null)
    });
    this.additionaLicenceFormGroup = fb.group({
      additionaLicence: new FormControl(null, Validators.required),
      enterAdditionaLicence: new FormControl(null)
    });
    this.provisionSoftwareFormGroup = fb.group({
      provisionSoftware: new FormControl(null, Validators.required),
      enterSoftware: new FormControl(null)
    });
    this.requireAccessFormGroup = fb.group({
      requireAccess: new FormControl(null, Validators.required),
      enterRequireAccess: new FormControl(null, Validators.required),
    });

    this.requireAccess2FormGroup = fb.group({
      requireAccess: new FormControl(null, Validators.required),
      enterRequireAccess: new FormControl(null, Validators.required),
    });

    this.requireAccessLiveFormGroup = fb.group({
      accessLive: new FormControl(null, Validators.required),
      enterAccessLive: new FormControl(null)
    });
    this.providedLocationFormGroup = fb.group({
      providedLocation: new FormControl(null, Validators.required),
      enterLocation: new FormControl(null)
    });
    this.dataClassificationFormGroup = fb.group({
      dataClassification: new FormControl(null)
    });
    this.dataClassificationLiveFormGroup = fb.group({
      dataClassification: new FormControl(null)
    });

    this.dataTrialFormGroup = fb.group({
      dataTrial: new FormControl(null, Validators.required)
    });
    this.outsideEEAFormGroup = fb.group({
      outsideEEA: new FormControl(null, Validators.required),
      enterEEA: new FormControl(null),
    });
    this.technicalOperationFormGroup = fb.group({
      technicalOperation: new FormControl(null, Validators.required),
      technicalOperation1: new FormControl(null)
    });
    this.additionalConditionsFormGroup = fb.group({
      additionalConditions: new FormControl(null, Validators.required),
      additionalConditions1: new FormControl(null)
    });
    this.filteredProjects = this.createProjectFormGroup.controls.linkedProject.valueChanges.pipe(
      startWith(''),
      map(project => project ? this._filterProjects(project) : this.projects.slice())
    );
    this.filteredSuppliers = this.chooseSupplierFormGroup.controls.supplierListPoc.valueChanges.pipe(
      startWith(''),
      map(supplier => supplier ? this._filterSuppliers(supplier) : this.suppliers.slice())
    );
    this.filteredProducts = this.chooseSupplierFormGroup.controls.productListPoc.valueChanges.pipe(
      startWith(''),
      map(product => product ? this._filterProducts(product) : this.products.slice())
    );
    this.filteredUsers = this.teamContactFormGroup.controls.userList.valueChanges.pipe(
      startWith(''),
      map(user => user ? this._filterUsers(user) : this.users.slice())
    );
  }
  ngOnInit() {
    if (this.data.step && this.data.step > 0) {
      this.readyToGo(null, this.data.step);
    }
  }
  checkInitialAnswers() {
    const productData = this.data.productData;
    if (productData.id.length > 0) {
      this.arryCond.chexboxFieldProduct = false;
      this.arryCond.fieldProduct = true;
      this.hostingDescritpionList = productData.details.access.testEnviromentDescription;
      this.productDetailDescription = productData.details.details.description;
      this.documentationDescription = productData.details.details.documentationDescription;
      this.chooseSupplierFormGroup.controls.supplierListPoc.setValue(productData.supplier.name);
      this.chooseSupplierFormGroup.controls.productListPoc.setValue(productData.product.name);
      this.chooseSupplierFormGroup.controls.supplierListPoc.disable();
      this.chooseSupplierFormGroup.controls.productListPoc.disable();

      const allCountires = getData();
      const EEAcountries = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
        'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO',
        'SK', 'SI', 'ES', 'CH', 'GB', 'SE'];
      const OutOfEEACountries = [];
      allCountires.forEach((item) => {
        const code = item.code;
        if (!EEAcountries.includes(code)) {
          OutOfEEACountries.push(code);
        }
      });
      /// HERE
      this.listStep.projectRequirements.show = this.allowUseCases === true;

      if (
        (productData.details.charges.trial === 'fixedFee' || (productData.details
          && productData.details.charges
          && productData.details.charges.chargesTrialFee
          && productData.details.charges.chargesTrialFee.toLowerCase() === 'yes'
        ))
        // tslint:disable-next-line:radix
        && parseInt(productData.details.charges.chargesAmtFee) > 0) {
        this.listStep.trailFee.show = true;
        if (this.trialFeeNegotiable === true) {
          this.trailFeeFormGroup.controls.trailFeeAmt.setValue(productData.details.charges.chargesAmtFee);
        }
        else {
          this.trailFeeFormGroup.controls.trailFeeAmt.setValue(0);
          this.trailFeeFormGroup.controls.trailFee.setValue('challenge');
        }

        this.trailFee = productData.details.charges.chargesAmtFee;
      }
      if (!productData.details.charges.trial && productData.details.licensing.copiesLimit === 'yes') {
        this.listStep.howManyCopies.show = this.projectService.questionsMap.supplier.licensing.copiesLimit.negotiable === true;
        this.maxCopiesLimit = productData.details.licensing.maxCopiesLimit; //  co to jest   this.maxCopiesLimit???
        // this.howManyCopiesFormGroup.patchValue( { howManyCopies: this.maxCopiesLimit } )
      }
      if (!productData.details.charges.trial && productData.details.access.usersLimit === 'yes') {
        this.listStep.howManyUsers.show = this.projectService.questionsMap.supplier.access.usersLimit.negotiable === true;
        this.maxUsersLimit = productData.details.access.maxUsersLimit;
        // this.howManyUsersFormGroup.patchValue( { howManyUsers: this.maxUsersLimit } )
      }
      this.listStep.testSystem.show = this.projectService.questionsMap.supplier.licensing.softwareLicence.negotiable === true && productData.details.licensing.softwareLicence === 'yes' && productData.details.access.testEnviroment === 'yes';
    }
    //// HERE END
  }
  readyToGo(stepper, toStep?: number) {
    this.initialaizingPOC = true;
    this.apiService.companyPOCProductDetails(this.data.handshakeID, true)
      .subscribe(
        async (data: HttpResponse<object>) => {
          const productData = data.body as any;
          this.productName = productData.product.name;
          this.projectName = productData.project.name;
          this.data.productData = productData;
          this.apiService.companyStartPOC(
            this.data.productData.project._id,
            this.data.productData.product._id,
            this.data.handshakeID)
            .subscribe((data: HttpResponse<object> | any) => {
              this.POCdb = data.body;
              this.allowComments = this.POCdb.allowComments;
              this.allowUseCases = this.POCdb.allowUseCases;
              const qMap: any = this.projectService.questionsMap;
              this.checkInitialAnswers();
              this.projectService.questionsAnswers[this.POCdb._id] = {};

              if (this.POCdb.justCreated !== true) {
                if (stepper) {
                  stepper.next();
                  this.initialaizingPOC = false;
                } else if (toStep && toStep > 0) {
                  setTimeout(() => {
                    this.goTo(toStep);
                    this.initialaizingPOC = false;
                  }, 1200);
                }
                return;
              }
              let allRequests = 0;
              let doneRequests = 0;
              const timeOutC = 0;
              const checkInitStatus = () => {
                if (this.initialaizingPOC === false) {
                  return;
                }
                if (doneRequests > allRequests * 0.9) {
                  if (stepper) {
                    stepper.next();
                  }
                  else if (toStep && toStep > 0) {
                    this.goTo(toStep);
                  }

                  this.initialaizingPOC = false;
                }
              };

              const createQuestion = (side, ind, question, q) => {
                if (!q.id) {
                  return;
                }

                const doCreate = async () => {
                  let initialAnswer;
                  if (side === 'supplier') {
                    initialAnswer = 'S';
                  }
                  else {
                    initialAnswer = 'B';
                  }

                  allRequests++;
                  this.apiService.companyPOCAddQuestion(
                    this.POCdb._id,
                    q.id,
                    q.sectionID,
                    q.challengeFor,
                    q.scheduleTitle,
                    q.onPOC,
                    q.riskReport,
                    q.negotiable,
                    initialAnswer,
                    q.question,
                    q.info,
                    q.negativeAnswer,
                    q.mustBe).subscribe(
                      async (data: HttpResponse<any>) => {
                        doneRequests++;
                        this.projectService.questionsAnswers[this.POCdb._id][q.id] = data.body;
                        let answer;
                        const scheetID = data.body._id;
                        if (side === 'supplier') {
                          answer = productData.details[ind][question];

                          if (scheetID === 'S51' && answer === 'yes') {
                            if (productData.details.access.testingAccessToNone) {
                              answer = 'none';
                            }
                            else {
                              answer = [];
                              if (productData.details.access.testingAccessToData) {
                                answer.push('Data');
                              }
                              if (productData.details.access.testingAccessToSytems) {
                                answer.push('Sytems');
                              }
                              if (productData.details.access.testingAccessToInfrastructure) {
                                answer.push('Infrastructure');
                              }
                              if (productData.details.access.testingAccessToPremises) {
                                answer.push('Premises');
                              }
                            }

                          } else if (scheetID === 'S53' && answer === 'yes') {
                            if (productData.details.access.liveAccessToNone) {
                              answer = 'none';
                            }
                            else {
                              answer = [];
                              if (productData.details.access.liveAccessToData) {
                                answer.push('Data');
                              }
                              if (productData.details.access.liveAccessToSytems) {
                                answer.push('Sytems');
                              }
                              if (productData.details.access.liveAccessToInfrastructure) {
                                answer.push('Infrastructure');
                              }
                              if (productData.details.access.liveAccessToPremises) {
                                answer.push('Premises');
                              }
                            }
                          }

                          allRequests++;
                          checkInitStatus();
                          // setTimeout(() => {
                          this.apiService.companyPOCAnswer(
                            this.POCdb._id,
                            q.id,
                            scheetID,
                            answer,
                            productData.product.updatedAt,
                            productData.product.createdBy).subscribe(
                              (dataQ: HttpResponse<Object>) => {
                                doneRequests++;
                                this.projectService.questionsAnswers[this.POCdb._id][q.id].answer = dataQ.body as any;
                                checkInitStatus();
                              },
                              (errorQ: any) => {
                                doneRequests++;
                                checkInitStatus();
                              });
                          // }, (allRequests*100));
                        }
                      },
                      (error: any) => {
                        doneRequests++;
                        console.log(error);
                        checkInitStatus();
                      });
                };
                doCreate();
              };
              for (const ind in qMap.supplier) {
                for (const question in qMap.supplier[ind]) {
                  const q = qMap.supplier[ind][question];
                  // if (!q.negotiable)
                  // continue
                  createQuestion('supplier', ind, question, q);
                }
              }
              for (const ind in qMap.buyer) {
                for (const question in qMap.buyer[ind]) {
                  const q = qMap.buyer[ind][question];
                  // if (!q.negotiable) {
                  //   continue;
                  // }
                  if (q.hasOwnProperty('agreeTo') || q.hasOwnProperty('challengeTo')) {
                    continue;
                  }
                  createQuestion('buyer', ind, question, q);
                }
              }
            });
        },
        (respError: Error) => {
          this.initialaizingPOC = false;
          console.log('respError', respError); // TO DO
        }
      );
    //
  }
  // INITIALIZING POC
  get countries() {
    return this.selectTerritoriesFormGroup.get('countries');
  }
  letGoMouseOver() {
    this.tl.pause();
  }
  letGoMouseOut() {
    this.tl.resume();
  }
  goTo(index: number) {
    console.log('this.stepper', this.stepper);
    // this.stepper.selectedIndex = index;
    try {
      // this.currentStep = index;
      this.stepper.selectedIndex = index;
    } catch (error) {
      this.goTo(index - 1);
    }
  }
  // MENU METHODS

  goBack(stepper: MatStepper) {
    this.messageError = ' ';
    stepper.previous();
  }
  skip(stepper: MatStepper) {
    this.messageError = '';
    stepper.next();
  }
  goForward(stepper: MatStepper) {
    this.messageError = ' ';
    const nameStep: string = this.stepper.selected.label;
    switch (nameStep) {
      case 'welcome': {
        // stepper.next();
        this.messageError = '';
        this.readyToGo(stepper);
        break;
      }


      case 'trailFee': {
        if (this.trailFeeFormGroup.invalid === true) {
          this.messageError = 'Filed(s) requried';
          break;
        }
        this.messageError = '';
        stepper.next();
        break;
      }

      case 'projectRequirements': {
        if (this.projectRequirementsFormGroup.invalid === true) {
          this.messageError = 'Filed(s) requried';
          break;
        }
        this.messageError = '';
        stepper.next();
        break;
      }


      case 'additionalConditions': {
        if (this.additionalConditionsFormGroup.invalid === true) {
          this.messageError = 'Please select an answer';
          break;
        }
        if (this.additionalConditionsFormGroup.value.additionalConditions === 'yes'
          && (!this.additionalConditionsFormGroup.value.additionalConditions1)
          || this.additionalConditionsFormGroup.value.additionalConditions1?.length === 0) {
          this.messageError = 'Please describe';
          break;
        }
        this.messageError = '';
        stepper.next();
        break;
      }

      case 'testSystem': {
        if (this.testSystemFormGroup.invalid === true) {
          this.messageError = 'Please select an answer';
          break;
        }
        if (this.testSystemFormGroup.value.testSystem === 'cloud system'
          && !this.testSystemFormGroup.value.testingEnv) {
          this.messageError = 'Please select an option';
          break;
        }

        const systemTest = this.testSystemFormGroup.controls.testSystem.value;
        if (systemTest === 'own system') {
          this.listStep.howManyCopies.show = this.projectService.questionsMap.supplier.licensing.copiesLimit.negotiable === true;
          this.listStep.howManyUsers.show = false;
          // this.listStep.acceptHosting.show = false;
        }
        else {
          this.listStep.howManyCopies.show = false;
          this.listStep.howManyUsers.show = this.projectService.questionsMap.supplier.licensing.copiesLimit.negotiable === true;
          // this.listStep.acceptHosting.show = true;
        }

        stepper.next();
        break;
      }
      ////

      case 'timeTrial': {
        if (this.timeTrialFormGroup.invalid === true) {
          this.messageError = 'Please choose a date';
          break;
        }
        // if (!this.validLeadTimeTrial()) {
        //  break
        // }
        stepper.next();
        break;
      }
      case 'howManyUsers': {
        if (this.howManyUsersFormGroup.invalid === true) {
          this.messageError = 'Filed(s) requried';
          break;
        }
        if (!this.validHowManyUsers()) {
          break;
        }
        stepper.next();
        break;
      }
      case 'howManyCopies': {
        if (this.howManyCopiesFormGroup.invalid === true) {
          this.messageError = 'Filed(s) requried';
          break;
        }
        if (!this.validHowManyCopies()) {
          break;
        }
        stepper.next();
        break;
      }
      case 'dataTrial': {
        const systemTest = this.dataTrialFormGroup.controls.dataTrial.value;
        if (systemTest === 'real') {
          this.arryCond.systemTestReal = true;

        }
        else {
          this.arryCond.systemTestReal = false;
        }
        stepper.next();
        break;
      }
      default: {
        stepper.next();
        break;
      }
    }
  }
  stepChangedEvent(stepper: MatStepper, event) {
    //  console.log("steps _results",stepper.steps._results);
    const allSteps = stepper.steps.toArray();
    const current = event.selectedIndex;
    const currentStep = allSteps[current];
    const currentStepName = currentStep.label;
    this.questionsFromPocExel = this.listStep[currentStepName].questionNR;

    // Save Prev
    const prev = event.previouslySelectedIndex;
    const step = allSteps[prev];
    const formGroupName = `${step.label}FormGroup`;
    const formGroup = this[formGroupName] as FormGroup;
    if (!formGroup) {
      switch (step.label) {
        case 'welcome':
          break;
        default:
          break;
      }
    } else {
      const stepObj = this.listStep[step.label];
      const qMap: any = this.projectService.questionsMap;
      for (const ind in formGroup.value) {
        let q;
        let answer;
        if (formGroupName === 'dataClassificationFormGroup' || formGroupName === 'dataClassificationLiveFormGroup') {
          answer = formGroup.value;
        } else if (formGroupName === 'additionalConditionsFormGroup') {
          answer = formGroup.value.additionalConditions === 'no' ? formGroup.value.additionalConditions : formGroup.value.additionalConditions1;
        } else if (formGroupName === 'projectRequirementsFormGroup') {
          answer = !formGroup.value[ind] ? 'no' : formGroup.value[ind];
        } else {
          answer = formGroup.value[ind];
        }

        if (answer !== 0 && (!answer || answer.length === 0)) {
          continue;
        }

        try {
          q = qMap.buyer[formGroupName][ind];

          let qID;
          let comment;
          let agreeTo = false;
          let challengeTo = false;
          let tbc = false;

          if (!q) {
            continue;
          }


          if (q.hasOwnProperty('agreeTo')) {
            qID = q.agreeTo;
            if (answer === 'tbc') {
              tbc = true;
            } else if (answer === q.ifNot) {
              continue;
            }
            agreeTo = true;
          } else if (q.hasOwnProperty('challengeTo')) {
            let shouldIProceed = false;
            let elseSo = 'no';
            if (q.hasOwnProperty('ifSo')) {
              for (const ch in qMap.buyer[formGroupName]) {
                for (const ifSo in q.ifSo) {
                  if (qMap.buyer[formGroupName][ch].id === ifSo && q.ifSo[ifSo] === formGroup.value[ch]) {
                    elseSo = formGroup.value[ch];
                    shouldIProceed = true;
                    break;
                  }
                }
              }
            } else {
              shouldIProceed = true;
            }

            if (shouldIProceed === false) {
              continue;
            }

            challengeTo = true;
            qID = q.challengeTo;
            if (q.takeValue === true) {

            } else {
              if (q.commentField) {
                comment = this[formGroupName].value[q.commentField];
              }
              else {
                comment = answer;
                if (elseSo === 'challenge') {
                  answer = null;
                } else {
                  answer = elseSo;
                } // 'no';
              }
            }
          } else {
            qID = q.id;
          }
          if (!comment && q.autoanswerComment && !q.negotiable) {
            comment = q.autoanswerComment;
          }

          let action;
          if (agreeTo === true) {
            // answer = null;
            comment = 'Agree';
          }
          if (q.id === 'B10') {
            answer = this.endTime;
          }

          if (q.id === 'B-S56') {
            answer = this.trailFeeFormGroup.controls.trailFeeAmt.value;
          }

          action = 'companyPOCAnswer';
          if (this.alreadyAnswered[currentStepName]) {
            if (this.alreadyAnswered[currentStepName].action === action
              && this.alreadyAnswered[currentStepName].answer === answer
              && this.alreadyAnswered[currentStepName].comment === comment) {
              return;
            }

          }
          console.log('\n', q.id);
          console.log('answer', answer);
          console.log('comment', comment);

          this.alreadyAnswered[currentStepName] = {
            action,
            POCdb: this.POCdb._id,
            answer,
            comment,
            challengeTo,
            tbc
          };

          this.apiService[action](this.POCdb._id, qID, null, answer, null, null, comment, challengeTo, true, tbc)
            .subscribe((data: HttpResponse<Object>) => {

            });

        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  stepChanged(stepper: MatStepper) {

  }

  addUserToList(event: MatAutocompleteSelectedEvent): void {
    const value: string = event.option.value;
    const user = this.users.find(x => x.id === value);
    const userText = user.first + ' ' + user.second + ' ' + user.email;
    const isInArray: boolean = this.choosenUserMail.includes(userText);
    this.messageError = '';
    if (isInArray) {
      this.messageError = 'This users was added to list';
    }
    if (this.choosenUserMail.length + this.newUsersList.length > 2) {
      this.messageError = 'You can add max. 3 users';
    }
    if (!isInArray && (this.choosenUserMail.length + this.newUsersList.length) < 3) {
      this.choosenUserMail.push(userText);
    }
    this.teamContactFormGroup.controls.userList.reset();
  }
  removeUsuerFromList(user: string): void {
    this.messageError = '';
    const index = this.choosenUserMail.indexOf(user);
    if (index > -1) {
      this.choosenUserMail.splice(index, 1);
    }
  }
  addNewUser() {
    const teamContact = this.teamContactFormGroup.controls;
    this.messageError = '';
    if (this.choosenUserMail.length + this.newUsersList.length > 2) {
      this.messageError = 'You can add max. 3 users';
    }
    if (!teamContact.newEMail.invalid && teamContact.newEMail.value.trim() !== '' &&
      (this.choosenUserMail.length + this.newUsersList.length) < 3) {
      this.newUsersList.push(teamContact.newEMail.value + ' / ' + teamContact.newLevel.value + ' / ' + teamContact.newRegion.value +
        ' / ' + teamContact.newBusiness.value);
      this.noteAddnewUser();
    }
  }
  removeNewUser(index) {
    if (index > -1) {
      this.newUsersList.splice(index, 1);
    }
  }

  showField(show: boolean, name) {
    this.arryCond[name] = show;
  }
  clearSupplierName() {
    this.arryCond.fieldProduct = !this.arryCond.fieldProduct;
    this.chooseSupplierFormGroup.controls.productListPoc.setValue('');
  }

  startDateChanged() {
    const currentStartDateValue = new Date(this.timeTrialFormGroup.controls.startDateTrial.value);
    const defaultEndDate = new Date(currentStartDateValue.setDate(currentStartDateValue.getDate() + 90));
    this.timeTrialFormGroup.controls.endDateTrial.setValue(defaultEndDate);

    this.endTime = defaultEndDate;
    this.minDateEnd = new Date(this.timeTrialFormGroup.controls.startDateTrial.value);
    this.changeDetector.detectChanges();

    return this.pickerTimeEnd = true;
  }

  endDateChanged() {

  }

  getEndTime() {
    if (this.timeTrialFormGroup.controls.endDateTrial.value) {
      return moment(this.timeTrialFormGroup.controls.endDateTrial.value).toDate();
    }
    return moment(this.endTime).toDate();
  }

  noteAddnewUser() {
    const ref = this.alertDialog.open(AlertModalComponent, {
      width: '400px',
      height: 'auto',
      disableClose: true,
      data: {
        title: 'Great',
        message: 'We have send an invitation for them to be added',
        links: null, actions: [{ label: 'Understand', color: 'green' }]
      }
    });
  }

  noteProductListPoc(event: MatAutocompleteSelectedEvent) {
    const value: string = event.option.viewValue;
    const result = this.products.find(x => x.name === value);

    if ((result.ref_2_9 === true) || (result.ref_2_10.length > 0)
      || (result.ref_2_6_4 === true) || result.ref_2_6_3.length > 0 || result.notification5.length > 0) {
      const ref = this.alertDialog.open(AlertModalPocComponent, {
        width: '560px',
        height: 'auto',
        disableClose: true,
        data: {
          title: '',
          notification1: result.ref_2_9,
          messageList1: result.ref_2_9b,
          notification2: result.ref_2_10,
          notification3: result.ref_2_6_4,
          messageList3: result.ref_2_6_5,
          notification4: result.ref_2_6_3,
          notification5: result.notification5,
          links: null,
          actions: [{ label: 'Understand', color: 'green' }]
        }
      });
    }
    event.source.closed;
  }

  dateClass = (d: Date) => {
    const date = d.getTime();
    let endTrialDate = 0;
    let startTrialDate = 0;


    if (this.timeTrialFormGroup.controls.startDateTrial.value != null) {
      startTrialDate = Date.parse(this.timeTrialFormGroup.controls.startDateTrial.value);
    }
    if (this.timeTrialFormGroup.controls.endDateTrial.value != null) {
      endTrialDate = Date.parse(this.timeTrialFormGroup.controls.endDateTrial.value);
    }
    return (date >= startTrialDate && date <= endTrialDate) ? 'mareked-date-class' : undefined;
  }

  validHowManyUsers() {
    if (this.maxUsersLimit > 0 && (this.howManyUsersFormGroup.controls.howManyUsers.value >
      this.maxUsersLimit || this.howManyUsersFormGroup.controls.howManyUsers.value < 1)) {
      this.alertDialog.open(AlertModalComponent, {
        width: '400px',
        height: 'auto',
        disableClose: true,
        data: {
          title: 'Please contact the Supplier if your requirements exceed. Number of Users:  '
            + this.maxUsersLimit, message: '', links: null, actions: [{ label: 'Understand', color: 'green' }]
        }
      });
      return false;
    }
    return true;
  }
  validHowManyCopies() {
    if (
      this.maxCopiesLimit > 0 &&
      (this.howManyCopiesFormGroup.controls.howManyCopies.value > this.maxCopiesLimit
        || this.howManyCopiesFormGroup.controls.howManyCopies.value < 1)) {
      this.alertDialog.open(AlertModalComponent, {
        width: '400px',
        height: 'auto',
        disableClose: true,
        data: {
          title: 'Please contact the Supplier if your requirements exceed. Number of copies:  '
            + this.maxCopiesLimit, message: '', links: null, actions: [{ label: 'Understand', color: 'green' }]
        }
      });
      return false;
    }
    return true;
  }

  async fin() {
    this.apiService.companySavePOC(this.POCdb._id, 'Draft', this.stepper.selectedIndex).subscribe((data: HttpResponse<object> | any) => {
      if (!this.projectService.projectsList) {
        // this.eventEmitterService.onEditPOC(this.data.productData);
        // product
      } else {
        for (let i = 0; i < this.projectService.projectsList.length; i++) {
          // this.data.productData.supplier._id === this.projectService.projectsList[i][] &&
          if (this.data.productData.product._id === this.projectService.projectsList[i].productID) {
            this.projectService.projectsList[i].pocStatus = data.body.status;
            this.projectService.projectsList[i].pocID = data.body._id;
            this.projectService.projectsList[i].pocStep = data.body.step;
            // open review

            this.eventEmitterService.onEditPOC(this.projectService.projectsList[i]);

            break;
          }
        }
      }
      this.dialogRef.close();
    }, (err: any) => {
      console.log(err);
      this.dialogRef.close();
    });
  }
  exit(stepper: MatStepper) {
    if (stepper.selectedIndex > 0) {
      const ref = this.alertDialog.open(AlertModalComponent, {
        width: '300px',
        height: 'auto',
        disableClose: true,
        data: {
          title: 'Are you sure you want exit?', message: '',
          links: null,
          actions: [{ label: 'Yes', color: 'primary' }, { label: 'No', color: 'primary' }]
        }
      });
      ref.afterClosed().subscribe(async (result) => {
        if (result === 'Yes') {
          this.dialogRef.close();
          ///
          this.apiService.companySavePOC(this.POCdb._id, null, stepper.selectedIndex)
            .subscribe((data: HttpResponse<object> | any) => {
              for (let i = 0; i < this.projectService.projectsList.length; i++) {
                // this.data.productData.supplier._id === this.projectService.projectsList[i][] &&
                if (this.data.productData.product._id === this.projectService.projectsList[i].productID) {
                  this.projectService.projectsList[i].pocStatus = data.body.status;
                  this.projectService.projectsList[i].pocID = data.body._id;
                  this.projectService.projectsList[i].pocStep = data.body.step;

                  break;
                }
              }
              //
              this.dialogRef.close();
            }, (err: any) => {
              this.dialogRef.close();
            });
          ///
        }
      });
    } else {
      this.dialogRef.close();
    }


  }
  shouldBeVisible(pFormGroup, controlName, visibleWhen?) {
    if (visibleWhen) {
      return pFormGroup.get(controlName).value === visibleWhen;
    }
    return pFormGroup.get(controlName) && pFormGroup.get(controlName).value && pFormGroup.get(controlName).value.length > 0;
  }

  private _filterProjects(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.projects.filter(project => project.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterSuppliers(value: string): Supplier[] {
    const filterValue = value.toLowerCase();
    return this.suppliers.filter(supplier => supplier.name && supplier.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterProducts(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name && product.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterUsers(value): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => (user.first && (user.first.toLowerCase().indexOf(filterValue) === 0)
      || (user.second && user.second.toLowerCase().indexOf(filterValue) === 0)));
  }
  save(draf?: boolean) {

    const POC = {
      createProject: this.createProjectFormGroup.value,
      projectRequirements: this.projectRequirementsFormGroup.value,
      chooseSupplier: this.chooseSupplierFormGroup.value,
      projectID: this.projectIDFormGroup.value,
      bankEntity: this.bankEntityFormGroup.value,
      teamContact: this.teamContactFormGroup.value,
      newUsersListTeamContact: this.newUsersList,
      solutionSuccessful: this.solutionSuccessfulFormGroup.value,
      trailFee: this.trailFeeFormGroup.value,
      specialConditions: this.specialConditionsFormGroup.value,
      timeTrial: this.timeTrialFormGroup.value,
      howManyUsers: this.howManyUsersFormGroup.value,
      testSystem: this.testSystemFormGroup.value,
      howManyCopies: this.howManyCopiesFormGroup.value,
      acceptHosting: this.acceptHostingFormGroup.value,
      customerEntity: this.customerEntityFormGroup.value,
      selectTerritories: this.selectTerritoriesFormGroup.value,
      additionaLicence: this.additionaLicenceFormGroup.value,
      provisionSoftware: this.providedLocationFormGroup.value,
      requireAccess: this.requireAccessFormGroup.value,
      requireAccessLive: this.requireAccessLiveFormGroup.value,
      dataTrial: this.dataTrialFormGroup.value,
      outsideEEA: this.outsideEEAFormGroup.value,
      providedLocation: this.providedLocationFormGroup.value,
      dataClassification: this.dataClassificationFormGroup.value,
      dataClassificationLive: this.dataClassificationLiveFormGroup.value,
      technicalOperation: this.technicalOperationFormGroup.value,
      additionalConditions: this.additionalConditionsFormGroup.value,
    };
  }
}
