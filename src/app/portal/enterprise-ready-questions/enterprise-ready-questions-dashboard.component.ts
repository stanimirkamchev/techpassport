import { Destroyable } from '@abstract/destroyable';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { PageService } from '@shared/page-service';
import * as ERQModel from './models';
import { ErqType } from './models/erq';
import * as ERQSelectors from './store/index.selector';
import * as ERQActions from './store/index.actions';
import { IErqDto } from './models/erq-dto';
import { ApiService } from '@services/api/api.service';
import { ERQProgressService } from './service/erq-proggress.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { HttpResponse } from '@angular/common/http';

type CrudMode = 'create' | 'update';
const stepType: { [key: number]: string } = {
  1: ErqType.Certification,
  2: ErqType.BreachNotification,
  3: ErqType.Ssdlc,
  4: ErqType.ApplicationSecurity,
  5: ErqType.DeletionRetention,
  6: ErqType.Privacy,
  7: ErqType.StorageSeparation,
  8: ErqType.Recovery,
  9: ErqType.Encryption
};

@Component({
  selector: 'enterprise-ready-questions-dashboard',
  templateUrl: './enterprise-ready-questions-dashboard.component.html',
  styleUrls: ['./enterprise-ready-questions-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseReadyQuestionsDashboardComponent extends Destroyable implements OnInit {

  @ViewChild('questionsAccordion') accordion: MatAccordion;
  loading = false;
  step = 0;
  form: FormGroup;
  dataSource: any[] = [];
  loaded = false;
  erqEntity: IErqDto = {} as IErqDto;
  crudMode: CrudMode | null = null;
  progressBar: { [key: string]: { completed: number, compliant: number } } = {
    total: {
      completed: 0,
      compliant: 0
    }
  };
  erqType = ErqType;
  readOnlyForm = null;
  constructor(
    private apiService: ApiService,
    private pageService: PageService,
    private formBuilder: FormBuilder,
    private store: Store,
    private progressService: ERQProgressService,
    public ref: ChangeDetectorRef,
    private snackbar: SnackbarService,
  ) {
    super();
    this.store.dispatch(ERQActions.loadDataTable());
    this.initProgressbar();
  }

  ngOnInit(): void {
    this.buildForm();
    this.populateForm();

    this.form.valueChanges.subscribe(val => {
      this.progressBar = this.progressService.calculateAlgorithm(val);
    });
  }

  setStep(index: number) {
    this.step = index;
  }

  continueButtonClicked() {
    const type = stepType[this.step];
    const data = this.form.value;
    this.apiService.postERQ(type, data).subscribe((resData: HttpResponse<any>) => {
      // this.snackbar.flash(`${'success'}`);
    },
      (respError: Error) => {
        this.snackbar.flash(`${respError.message ?? 'Something went wrong, please try again'}`);
      }
    );
    this.step++;
  }

  cancelButtonClicked(group: string) {
    this.form.get(group).setValue(this.readOnlyForm.value[group]);
    this.step = null;
    this.accordion.closeAll();
  }

  backButtonClicked() {
    this.step = undefined;
    this.accordion.closeAll();
    this.pageService.emitValue('dashboard');
  }

  saveButtonClicked() {
    this.apiService.postERQ('all', this.form.value).subscribe((resData: HttpResponse<any>) => {
      // this.snackbar.flash(`${'success'}`);
      this.backButtonClicked();
    },
      (respError: Error) => {
        this.snackbar.flash(`${respError.message ?? 'Something went wrong, please try again'}`);
      }
    );
    this.step = null;
    this.accordion.closeAll();
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        [ErqType.Certification]: this.formBuilder.group({
          currentAccreditations: new FormGroup({
            soc2: new FormControl(null),
            iso27001: new FormControl(null),
            other: new FormControl(null),
            none: new FormControl(null)
          }),
          soc2Certificate: new FormGroup({
            socUpToDate: new FormControl(null),
            socFileInfo: new FormControl(null),
            socRenewalDate: new FormControl(null),
            socPlansToObtain: new FormControl(null),
            socExpectedDate: new FormControl(null),
          }),
          iso27001Certificate: new FormGroup({
            isoUpToDate: new FormControl(null),
            isoFileInfo: new FormControl(null),
            isoRenewalDate: new FormControl(null),
            isoPlansToObtain: new FormControl(null),
            isoExpectedDate: new FormControl(null)
          }),
          otherCertificate: new FormGroup({
            name: new FormControl(null),
            otherUpToDate: new FormControl(null),
            otherFileInfo: new FormControl(null),
            otherRenewalDate: new FormControl(null),
            otherPlansToObtain: new FormControl(null),
            otherExpectedDate: new FormControl(null)
          })
        }),
        [ErqType.BreachNotification]: this.formBuilder.group({
          breachNotification: new FormControl(null)
        }),
        [ErqType.Ssdlc]: this.formBuilder.group({
          penetrationTestCovering: new FormControl(null)
        }),
        [ErqType.ApplicationSecurity]: this.formBuilder.group({
          authenticationMethods: new FormGroup({
            saml_oidc_sso: new FormControl(null),
            password_source_ip_validation: new FormControl(null),
            password_source_ip_validation_api: new FormControl(null),
            other: new FormControl(null),
            none: new FormControl(null),
            otherName: new FormControl(null),
          }),
          encryptionMethodOptions: new FormGroup({
            aes_128_192_256: new FormControl(null),
            sha_256_384_512: new FormControl(null),
            argon_pbkdf2: new FormControl(null),
            other: new FormControl(null),
            none: new FormControl(null),
            otherName: new FormControl(null),
          })
        }),
        [ErqType.DeletionRetention]: this.formBuilder.group({
          deleteAbility: new FormControl(null),
          provideACopy: new FormControl(null),
          currentProcessExplanationOfDeletingCustomersData: new FormControl(null),
          currentProcessExplanationOfCopyingCustomersData: new FormControl(null),
          maintainMultipleCopiesOfData: new FormGroup({
            yes: new FormControl(null),
            no: new FormControl(null),
          })
        }),
        [ErqType.Privacy]: this.formBuilder.group({
          countryRegionOptions: new FormGroup({
            country_uk: new FormControl(null),
            country_usa: new FormControl(null),
            country_canada: new FormControl(null),
            country_eu: new FormControl(null),
            country_none: new FormControl(null)
          }),
          regionalLegislationAreas: new FormGroup({
            legislation_uk: new FormControl(null),
            legislation_usa: new FormControl(null),
            legislation_canada: new FormControl(null),
            legislation_eu: new FormControl(null)
          }),
          protectionActOptions: new FormGroup({
            gdpr: new FormControl(null),
            ccpa: new FormControl(null),
            pipeda: new FormControl(null),
            other: new FormControl(null),
            otherText: new FormControl(null)
          }),
          whereDataIsConsumed: new FormGroup({
            data_consumed_uk: new FormControl(null),
            data_consumed_usa: new FormControl(null),
            data_consumed_canada: new FormControl(null),
            data_consumed_eu: new FormControl(null),
            data_consumed_no: new FormControl(null)
          }),
          inclusionPermissions: new FormGroup({
            yes: new FormControl(null),
            no: new FormControl(null),
          })
        }),
        [ErqType.StorageSeparation]: this.formBuilder.group({
          guaranteeLocation: new FormControl(null),
          moreInfo: new FormControl(null),
          serviceProvidedCountryRegions: new FormGroup({
            country_uk: new FormControl(null),
            country_usa: new FormControl(null),
            country_canada: new FormControl(null),
            country_eu: new FormControl(null),
            country_other: new FormControl(null),
            country_other_text: new FormControl(null)
          }),
          dataMaintenanceLocations: new FormGroup({
            country_uk: new FormControl(null),
            country_usa: new FormControl(null),
            country_canada: new FormControl(null),
            country_eu: new FormControl(null),
            country_other: new FormControl(null),
            country_other_text: new FormControl(null)
          }),
          logicalSegregation: new FormGroup({
            utilize: new FormControl(null),
            moreInfo: new FormControl(null)
          }),
          separateDataSetAccess: new FormGroup({
            dataSetAccess: new FormControl(null),
            setAccessMoreInfo: new FormControl(null)
          }),
          processChangeManagement: new FormGroup({
            changeManagement: new FormControl(null),
            changeManagementMoreInfo: new FormControl(null)
          })
        }),
        [ErqType.Recovery]: this.formBuilder.group({
          criticality: new FormControl(null),
          recoveryTime: new FormControl(null),
        }),
        [ErqType.Encryption]: this.formBuilder.group({
          cryptographicControls: new FormGroup({
            yes: new FormControl(null),
            no: new FormControl(null),
          }),
          digitalSignature: new FormControl(null),
          encryptionMethod: new FormControl(null),
          allEncryptionKeysUsed: new FormControl(null),
          allEncryptionKeysMoreInfo: new FormControl(null),
          encryptionKeyRotation: new FormControl(null),
          allEncryptionKeysUsedInConjunction: new FormControl(null),
        }),
      }
    );
    this.readOnlyForm = Object.assign({}, this.form);
  }

  private populateForm() {
    this.store.select(ERQSelectors.selectERQState).subscribe((responseData: { loading: boolean, loaded: boolean, data: IErqDto }) => {
      this.loading = responseData.loading;
      this.erqEntity = responseData.data;

      if (!this.erqEntity || Object.keys(this.erqEntity).length === 0) {
        this.loading = false;
        this.loaded = true;
        this.crudMode = 'create';
        return;
      }

      if (!responseData.loading && responseData.loaded) {
        const certification = new ERQModel.Certification(this.erqEntity.certification).data;
        const breach = new ERQModel.BreachNotification(this.erqEntity.breachNotification).data;
        const ssdlc = new ERQModel.Ssdlc(this.erqEntity.ssdlc).data;
        const appSecurity = new ERQModel.ApplicationSecurity(this.erqEntity.applicationSecurity).data;
        const deletionRetention = new ERQModel.DeletionRetention(this.erqEntity.deletionRetention).data;
        const privacy = new ERQModel.Privacy(this.erqEntity.privacy).data;
        const storage = new ERQModel.StorageSeparation(this.erqEntity.storageSeparation).data;
        const recovery = new ERQModel.Recovery(this.erqEntity.recovery).data;
        const encryption = new ERQModel.Encryption(this.erqEntity.encryption).data;

        if (certification) {
          this.form.get([ErqType.Certification, 'currentAccreditations']).setValue(certification.currentAccreditations);
          this.form.get([ErqType.Certification, 'soc2Certificate']).setValue(certification.soc2Certificate);
          this.form.get([ErqType.Certification, 'iso27001Certificate']).setValue(certification.iso27001Certificate);
          this.form.get([ErqType.Certification, 'otherCertificate']).setValue(certification.otherCertificate);
        }

        if (breach) {
          this.form.get(ErqType.BreachNotification).setValue(breach);
        }

        if (ssdlc) {
          this.form.get(ErqType.Ssdlc).setValue(ssdlc);
        }

        if (appSecurity) {
          this.form.get([ErqType.ApplicationSecurity, 'authenticationMethods']).setValue(appSecurity.authenticationMethods);
          this.form.get([ErqType.ApplicationSecurity, 'encryptionMethodOptions']).setValue(appSecurity.encryptionMethodOptions);
        }

        if (deletionRetention) {
          this.form.get(ErqType.DeletionRetention).setValue(deletionRetention);
          this.form.get([ErqType.DeletionRetention, 'maintainMultipleCopiesOfData']).setValue(deletionRetention.maintainMultipleCopiesOfData);
        }

        if (privacy) {
          this.form.get([ErqType.Privacy, 'countryRegionOptions']).setValue(privacy.countryRegionOptions);
          this.form.get([ErqType.Privacy, 'regionalLegislationAreas']).setValue(privacy.regionalLegislationAreas);
          this.form.get([ErqType.Privacy, 'protectionActOptions']).setValue(privacy.protectionActOptions);
          this.form.get([ErqType.Privacy, 'whereDataIsConsumed']).setValue(privacy.whereDataIsConsumed);
          this.form.get([ErqType.Privacy, 'inclusionPermissions']).setValue(privacy.inclusionPermissions);
        }

        if (storage) {
          this.form.get(ErqType.StorageSeparation).setValue(storage);
          this.form.get([ErqType.StorageSeparation, 'serviceProvidedCountryRegions']).setValue(storage.serviceProvidedCountryRegions);
          this.form.get([ErqType.StorageSeparation, 'dataMaintenanceLocations']).setValue(storage.dataMaintenanceLocations);
          this.form.get([ErqType.StorageSeparation, 'logicalSegregation']).setValue(storage.logicalSegregation);
          this.form.get([ErqType.StorageSeparation, 'separateDataSetAccess']).setValue(storage.separateDataSetAccess);
          this.form.get([ErqType.StorageSeparation, 'processChangeManagement']).setValue(storage.processChangeManagement);
        }

        if (recovery) {
          this.form.get(ErqType.Recovery).setValue(recovery);
        }

        if (encryption) {
          this.form.get(ErqType.Encryption).setValue(encryption);
          this.form.get([ErqType.Encryption, 'cryptographicControls']).setValue(encryption.cryptographicControls);
        }

        this.crudMode = 'update';
        this.loaded = responseData.loaded;
        this.ref.detectChanges();
        this.readOnlyForm = Object.assign({}, this.form);
        return;
      }
    });
  }

  private initProgressbar() {
    this.progressBar = {
      [ErqType.Certification]: { completed: 0, compliant: 0 },
      [ErqType.BreachNotification]: { completed: 0, compliant: 0 },
      [ErqType.Ssdlc]: { completed: 0, compliant: 0 },
      [ErqType.ApplicationSecurity]: { completed: 0, compliant: 0 },
      [ErqType.DeletionRetention]: { completed: 0, compliant: 0 },
      [ErqType.Privacy]: { completed: 0, compliant: 0 },
      [ErqType.StorageSeparation]: { completed: 0, compliant: 0 },
      [ErqType.Recovery]: { completed: 0, compliant: 0 },
      [ErqType.Encryption]: { completed: 0, compliant: 0 },
      total: { completed: 0, compliant: 0 },
    };
  }

  navigateToHelp() {
    window.open('https://techpassport.zendesk.com/hc/en-gb', '_blank');
  }
}
