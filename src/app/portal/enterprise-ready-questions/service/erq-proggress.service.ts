import { Injectable } from '@angular/core';
import { ErqType, IErq } from '../models/erq';
import * as Interface from '../models/index';

type Equation = { completed: number, compliant: number };
type ProgressBar = { [key: string]: Equation };

@Injectable({
  providedIn: 'root'
})
export class ERQProgressService {

  private progressBar: ProgressBar = {};

  public calculateAlgorithm(val: IErq) {
    this.progressBar[ErqType.Certification] = this.certification(val.certification);
    this.progressBar[ErqType.BreachNotification] = this.breachNotification(val.breachNotification);
    this.progressBar[ErqType.Ssdlc] = this.ssdlc(val.ssdlc);
    this.progressBar[ErqType.ApplicationSecurity] = this.applicationSecurity(val.applicationSecurity);
    this.progressBar[ErqType.DeletionRetention] = this.deletionRetention(val.deletionRetention);
    this.progressBar[ErqType.Privacy] = this.privacy(val.privacy);
    this.progressBar[ErqType.StorageSeparation] = this.storageSeparation(val.storageSeparation, val.privacy);
    this.progressBar[ErqType.Recovery] = this.recovery(val.recovery);
    this.progressBar[ErqType.Encryption] = this.encryption(val.encryption);
    this.progressBar.total = this.totalSum(this.progressBar);
    return this.progressBar;
  }

  private certification(val: Interface.ICertification): Equation {
    // tslint:disable-next-line:max-line-length
    const CG_1 = val.currentAccreditations.soc2 && val.soc2Certificate.socUpToDate && val.soc2Certificate.socFileInfo && val.soc2Certificate.socRenewalDate;

    // tslint:disable-next-line:max-line-length
    const CG_2 = val.currentAccreditations.soc2 && !val.soc2Certificate.socUpToDate && val.soc2Certificate.socPlansToObtain && val.soc2Certificate.socExpectedDate;

    const CG_3 = val.currentAccreditations.soc2 && !val.soc2Certificate.socExpectedDate && !val.soc2Certificate.socPlansToObtain;

    // tslint:disable-next-line:max-line-length
    const CG_4 = val.currentAccreditations.iso27001 && val.iso27001Certificate.isoUpToDate && val.iso27001Certificate.isoFileInfo && val.iso27001Certificate.isoRenewalDate;

    // tslint:disable-next-line:max-line-length
    const CG_5 = val.currentAccreditations.iso27001 && !val.iso27001Certificate.isoUpToDate && val.iso27001Certificate.isoPlansToObtain && val.iso27001Certificate.isoExpectedDate;

    const CG_6 = val.currentAccreditations.iso27001 && !val.iso27001Certificate.isoUpToDate && !val.iso27001Certificate.isoPlansToObtain;

    // tslint:disable-next-line:max-line-length
    const CG_7 = val.currentAccreditations.other && val.otherCertificate.name && val.otherCertificate.otherUpToDate && val.otherCertificate.otherFileInfo && val.otherCertificate.otherRenewalDate;

    // tslint:disable-next-line:max-line-length
    const CG_8 = val.currentAccreditations.other && val.otherCertificate.name && !val.otherCertificate.otherUpToDate && val.otherCertificate.otherPlansToObtain && val.otherCertificate.otherExpectedDate;

    // tslint:disable-next-line:max-line-length
    const CG_9 = val.currentAccreditations.other && val.otherCertificate.name && !val.otherCertificate.otherUpToDate && !val.otherCertificate.otherPlansToObtain;

    const CON_1 = val.currentAccreditations.soc2 && val.soc2Certificate.socUpToDate;
    const CON_2 = val.currentAccreditations.soc2 && val.soc2Certificate.socUpToDate === false && val.soc2Certificate.socPlansToObtain;
    const CON_3 = val.currentAccreditations.soc2 && val.soc2Certificate.socUpToDate === false && val.soc2Certificate.socPlansToObtain === false;
    const CON_4 = val.currentAccreditations.iso27001 && val.iso27001Certificate.isoUpToDate;
    const CON_5 = val.currentAccreditations.iso27001 && val.iso27001Certificate.isoUpToDate === false && val.iso27001Certificate.isoPlansToObtain;
    const CON_6 = val.currentAccreditations.iso27001 && val.iso27001Certificate.isoUpToDate === false && val.iso27001Certificate.isoPlansToObtain === false;
    const CON_7 = val.currentAccreditations.other && val.otherCertificate.name && val.otherCertificate.otherUpToDate;
    // tslint:disable-next-line:max-line-length
    const CON_8 = val.currentAccreditations.other && val.otherCertificate.name && val.otherCertificate.otherUpToDate === false && val.otherCertificate.otherPlansToObtain;
    // tslint:disable-next-line:max-line-length
    const CON_9 = val.currentAccreditations.other && val.otherCertificate.name && val.otherCertificate.otherUpToDate === false && val.otherCertificate.otherPlansToObtain === false;

    const A = CON_1
      ? this.checkGroupTrueOrFilledCount({
        1: val.currentAccreditations.soc2, 2: val.soc2Certificate.socUpToDate, 3: val.soc2Certificate.socFileInfo, 4: val.soc2Certificate.socRenewalDate
      })
      : 0;
    const B = CON_2
      ? this.checkGroupTrueOrFilledCount({
        // tslint:disable-next-line:max-line-length
        1: val.currentAccreditations.soc2, 2: !val.soc2Certificate.socUpToDate, 3: val.soc2Certificate.socPlansToObtain === true, 4: val.soc2Certificate.socExpectedDate
      })
      : 0;
    const C = CON_3
      ? this.checkGroupTrueOrFilledCount({
        1: val.currentAccreditations.soc2, 2: val.soc2Certificate.socPlansToObtain === false, 3: !val.soc2Certificate.socExpectedDate
      }) : 0;
    const D = CON_4
      ? this.checkGroupTrueOrFilledCount({
        // tslint:disable-next-line:max-line-length
        1: val.currentAccreditations.iso27001, 2: val.iso27001Certificate.isoUpToDate, 3: val.iso27001Certificate.isoFileInfo, 4: val.iso27001Certificate.isoRenewalDate
      })
      : 0;
    const E = CON_5 ?
      this.checkGroupTrueOrFilledCount({
        // tslint:disable-next-line:max-line-length
        1: val.currentAccreditations.iso27001, 2: !val.iso27001Certificate.isoUpToDate, 3: val.iso27001Certificate.isoPlansToObtain === true, 4: val.iso27001Certificate.isoExpectedDate
      })
      : 0;
    const F = CON_6 ?
      this.checkGroupTrueOrFilledCount({
        // tslint:disable-next-line:max-line-length
        1: val.currentAccreditations.iso27001, 3: val.iso27001Certificate.isoPlansToObtain === false, 4: !val.iso27001Certificate.isoExpectedDate
      })
      : 0;
    const G = CON_7
      ? this.checkGroupTrueOrFilledCount({
        // tslint:disable-next-line:max-line-length
        1: val.currentAccreditations.other, 2: val.otherCertificate.otherUpToDate, 3: val.otherCertificate.otherFileInfo, 4: val.otherCertificate.otherRenewalDate, 5: val.otherCertificate.name
      })
      : 0;
    const H = CON_8 ?
      this.checkGroupTrueOrFilledCount({
        // tslint:disable-next-line:max-line-length
        1: val.currentAccreditations.other, 2: val.otherCertificate.otherUpToDate === false, 3: val.otherCertificate.otherPlansToObtain, 4: val.otherCertificate.otherExpectedDate, 5: val.otherCertificate.name
      })
      : 0;
    const I = CON_9 ?
      this.checkGroupTrueOrFilledCount({
        // tslint:disable-next-line:max-line-length
        1: val.currentAccreditations.other, 2: val.otherCertificate.otherUpToDate === false, 3: val.otherCertificate.otherPlansToObtain === false, 4: val.otherCertificate.name
      })
      : 0;

    const completed = (v: Interface.ICertification) => {
      let res = 0;
      if (val.currentAccreditations.none) {
        res = 100;
      }
      if (val.currentAccreditations.soc2 || val.currentAccreditations.iso27001 || val.currentAccreditations.other) {
        const j = this.checkGroupTrueCount(val.currentAccreditations);

        res = ((A * 25) + (B * 25) + (C * 33.33) + (D * 25) + (E * 25) + (F * 33.33) + (G * 20) + (H * 20) + (I * 25)) / (j);
      }
      return res;
    };

    const compliant = (v: Interface.ICertification) => {
      let res = 0;

      if (CG_1 || CG_4) {
        res = 100;
      }

      // res = res > 100 ? 100 : res;
      return res;
    };

    return {
      completed: completed(val),
      compliant: compliant(val)
    };
  }

  private breachNotification(val: Interface.IBreachNotification): Equation {
    return {
      completed: val.breachNotification === true || val.breachNotification === false ? 100 : 0,
      compliant: val.breachNotification === true ? 100 : 0
    };
  }

  private ssdlc(val: Interface.ISsdlc): Equation {
    return {
      completed: val.penetrationTestCovering === true || val.penetrationTestCovering === false ? 100 : 0,
      compliant: val.penetrationTestCovering === true ? 100 : 0
    };
  }

  private applicationSecurity(val: Interface.IApplicationSecurity): Equation {
    const completed = (v: Interface.IApplicationSecurity): number => {
      const Q_1 = this.checkGroupHasTrue(v.authenticationMethods, 50);
      const Q_2 = this.checkGroupHasTrue(v.encryptionMethodOptions, 50);
      return Q_1 + Q_2 > 100 ? 100 : Q_1 + Q_2;
    };

    const compliant = (v: Interface.IApplicationSecurity): number => {
      const zeroPointFields = ['none', 'otherName', 'other', 'argon_pbkdf2'];
      const Q_1 = this.checkGroupHasTrue(v.authenticationMethods, 50, zeroPointFields);
      const Q_2 = this.checkGroupHasTrue(v.encryptionMethodOptions, 50, zeroPointFields);
      return Q_1 + Q_2 > 100 ? 100 : Q_1 + Q_2;
    };

    return {
      completed: completed(val),
      compliant: compliant(val)
    };
  }

  private deletionRetention(val: Interface.IDeletionRetention): Equation {
    const completed = (v: Interface.IDeletionRetention): number => {
      const Q_1 = v.deleteAbility === true && !v.currentProcessExplanationOfDeletingCustomersData
        ? 16.66
        : v.deleteAbility === true && v.currentProcessExplanationOfDeletingCustomersData
          ? 33.33
          : v.deleteAbility === false
            ? 33.33
            : 33.33;

      const Q_2 = v.provideACopy === true && !v.currentProcessExplanationOfCopyingCustomersData
        ? 16.66
        : v.provideACopy === true && v.currentProcessExplanationOfCopyingCustomersData
          ? 33.33
          : v.provideACopy === false
            ? 33.33
            : 33.33;

      const Q_3 = v.maintainMultipleCopiesOfData.yes || v.maintainMultipleCopiesOfData.no ? 33.33 : 33.33;
      const res = Number((Q_1 + Q_2 + Q_3).toFixed(2));
      return res;
    };

    const compliant = (v: Interface.IDeletionRetention): number => {
      const Q_1 = v.deleteAbility === true && !v.currentProcessExplanationOfDeletingCustomersData
        ? 16.66
        : v.deleteAbility === true && v.currentProcessExplanationOfDeletingCustomersData
          ? 33.33
          : v.deleteAbility === false
            ? 0
            : 33.33;

      const Q_2 = v.provideACopy === true && !v.currentProcessExplanationOfCopyingCustomersData
        ? 16.66
        : v.provideACopy === true && v.currentProcessExplanationOfCopyingCustomersData
          ? 33.33
          : v.provideACopy === false
            ? 0
            : 33.33;

      const Q_3 = v.maintainMultipleCopiesOfData.yes === true
        ? 33.33
        : v.maintainMultipleCopiesOfData.yes == null && v.maintainMultipleCopiesOfData.no == null
          ? 33.33
          : 0;

      const res = Number((Q_1 + Q_2 + Q_3).toFixed(2));
      return res;
    };

    return {
      completed: completed(val),
      compliant: compliant(val)
    };
  }

  private privacy(val: Interface.IPrivacy): Equation {
    const completed = (v: Interface.IPrivacy): number => {
      const Q_1 = this.checkGroupHasTrue(v.countryRegionOptions, 20);
      const Q_2 = this.checkGroupHasTrue(v.regionalLegislationAreas, 20);
      const Q_3 = this.checkGroupHasTrue(v.protectionActOptions, 20);
      const Q_4 = this.checkGroupHasTrue(v.whereDataIsConsumed, 20);
      const Q_5 = 20;
      return Q_1 + Q_2 + Q_3 + Q_4 + Q_5;
    };

    const compliant = (v: Interface.IPrivacy): number => {
      const Q_1 = v.countryRegionOptions.country_uk
        && v.regionalLegislationAreas.legislation_uk
        && v.protectionActOptions.gdpr
        && v.whereDataIsConsumed.data_consumed_uk
        && (v.inclusionPermissions.yes || v.inclusionPermissions.yes === null && v.inclusionPermissions.no === null) ? 1 : 0;
      const Q_2 = v.countryRegionOptions.country_usa
        && v.regionalLegislationAreas.legislation_usa
        && v.protectionActOptions.ccpa
        && v.whereDataIsConsumed.data_consumed_usa
        && (v.inclusionPermissions.yes || v.inclusionPermissions.yes === null && v.inclusionPermissions.no === null) ? 1 : 0;
      const Q_3 = v.countryRegionOptions.country_canada
        && v.regionalLegislationAreas.legislation_canada
        && v.protectionActOptions.pipeda
        && v.whereDataIsConsumed.data_consumed_canada
        && (v.inclusionPermissions.yes || v.inclusionPermissions.yes === null && v.inclusionPermissions.no === null) ? 1 : 0;
      const Q_4 = v.countryRegionOptions.country_eu
        && v.regionalLegislationAreas.legislation_eu
        && v.protectionActOptions.gdpr
        && v.whereDataIsConsumed.data_consumed_eu
        && (v.inclusionPermissions.yes || v.inclusionPermissions.yes === null && v.inclusionPermissions.no === null) ? 1 : 0;

      let res = (Q_1 + Q_2 + Q_3 + Q_4);
      res = res === 0 ? 0 : Number((res * 100 / this.checkGroupTrueCount(v.countryRegionOptions)).toFixed(2));
      return res;
    };

    return {
      completed: completed(val),
      compliant: compliant(val)
    };
  }

  private storageSeparation(val: Interface.IStorageSeparation, privacy: Interface.IPrivacy): Equation {
    const completed = (v: Interface.IStorageSeparation): number => {
      const Q_1 = v.guaranteeLocation === true && !v.moreInfo
        ? 10
        : v.guaranteeLocation === true && v.moreInfo
          ? 20
          : v.guaranteeLocation === false
            ? 20
            : 20;

      const Q_2 = 20; // this.checkGroupHasTrue(v.dataMaintenanceLocations, 20);

      const Q_3 = v.logicalSegregation.utilize === true && !v.logicalSegregation.moreInfo
        ? 10
        : v.logicalSegregation.utilize === true && v.logicalSegregation.moreInfo
          ? 20
          : v.logicalSegregation.utilize === false
            ? 20
            : 20;

      const Q_4 = v.separateDataSetAccess.dataSetAccess === true && !v.separateDataSetAccess.setAccessMoreInfo
        ? 10
        : v.separateDataSetAccess.dataSetAccess === true && v.separateDataSetAccess.setAccessMoreInfo
          ? 20
          : v.separateDataSetAccess.dataSetAccess === false
            ? 20
            : 20;

      const Q_5 = v.processChangeManagement.changeManagement === true && !v.processChangeManagement.changeManagementMoreInfo
        ? 10
        : v.processChangeManagement.changeManagement === true && v.processChangeManagement.changeManagementMoreInfo
          ? 20
          : v.processChangeManagement.changeManagement === false
            ? 20
            : 20;

      const res = (Q_1 + Q_2 + Q_3 + Q_4 + Q_5);
      return res;
    };

    const compliant = (v: Interface.IStorageSeparation): number => {
      const Q_1 = v.guaranteeLocation === true && !v.moreInfo
        ? 10
        : v.guaranteeLocation === true && v.moreInfo
          ? 20
          : v.guaranteeLocation === false
            ? 0
            : 20;

      let Q_2 = (
        v.dataMaintenanceLocations.country_canada == null
        && v.dataMaintenanceLocations.country_eu == null
        && v.dataMaintenanceLocations.country_uk == null
        && v.dataMaintenanceLocations.country_usa == null
        && v.dataMaintenanceLocations.country_other == null
      )
        ? 20
        : this.checkGroupTrueCount(privacy.countryRegionOptions) === 0
          ? 0
          : this.checkGroupTrueCount(v.dataMaintenanceLocations) * 20 / this.checkGroupTrueCount(privacy.countryRegionOptions);

      Q_2 = Q_2 > 20 ? 20 : Q_2;

      const Q_3 = v.logicalSegregation.utilize === true && !v.logicalSegregation.moreInfo
        ? 10
        : v.logicalSegregation.utilize === true && v.logicalSegregation.moreInfo
          ? 20
          : v.logicalSegregation.utilize === false
            ? 0
            : 20;

      const Q_4 = v.separateDataSetAccess.dataSetAccess === true && !v.separateDataSetAccess.setAccessMoreInfo
        ? 10
        : v.separateDataSetAccess.dataSetAccess === true && v.separateDataSetAccess.setAccessMoreInfo
          ? 20
          : v.separateDataSetAccess.dataSetAccess === false
            ? 0
            : 20;

      const Q_5 = v.processChangeManagement.changeManagement === true && !v.processChangeManagement.changeManagementMoreInfo
        ? 10
        : v.processChangeManagement.changeManagement === true && v.processChangeManagement.changeManagementMoreInfo
          ? 20
          : v.processChangeManagement.changeManagement === false
            ? 0
            : 20;

      const res = (Q_1 + Q_2 + Q_3 + Q_4 + Q_5);
      return res;
    };
    return {
      completed: completed(val),
      compliant: compliant(val)
    };
  }

  private recovery(val: Interface.IRecovery): Equation {
    const completed = (v: Interface.IRecovery): number => {
      const Q_1 = v.criticality === 'unknown'
        ? 0
        : v.criticality === 'low risk'
          ? 100
          : v.criticality === 'high risk' && (v.recoveryTime == null || Number(v.recoveryTime) < 0)
            ? 50
            : v.criticality === 'high risk' && (v.recoveryTime != null && Number(v.recoveryTime) >= 0)
              ? 100
              : 0;

      return Q_1;
    };

    const compliant = (v: Interface.IRecovery): number => {
      const Q_1 = v.criticality === 'low risk'
        ? 100
        : v.criticality === 'high risk' && (v.recoveryTime != null && Number(v.recoveryTime) >= 0) ? 100 : 0;
      return Q_1;
    };
    return {
      completed: completed(val),
      compliant: compliant(val)
    };
  }

  private encryption(val: Interface.IEncryption): Equation {
    const completed = (v: Interface.IEncryption): number => {
      // tslint:disable-next-line:max-line-length
      const Q_1 = v.cryptographicControls.yes === true || v.cryptographicControls.no === true || (v.cryptographicControls.yes === null && v.cryptographicControls.no === null) ? 20 : 20;

      const Q_2 = v.digitalSignature === true && !v.encryptionMethod
        ? 10
        : v.digitalSignature === true && v.encryptionMethod
          ? 20
          : v.digitalSignature === false
            ? 20
            : 20;

      const Q_3 = v.allEncryptionKeysUsed === true && !v.allEncryptionKeysMoreInfo
        ? 10
        : v.allEncryptionKeysUsed === true && v.allEncryptionKeysMoreInfo
          ? 20
          : v.allEncryptionKeysUsed === false
            ? 20
            : 20;

      const Q_4 = v.encryptionKeyRotation === true || v.encryptionKeyRotation === false || v.encryptionKeyRotation === null ? 20 : 0;

      // tslint:disable-next-line:max-line-length
      const Q_5 = v.allEncryptionKeysUsedInConjunction === true || v.allEncryptionKeysUsedInConjunction === false || v.allEncryptionKeysUsedInConjunction === null ? 20 : 0;

      const res = Q_1 + Q_2 + Q_3 + Q_4 + Q_5;
      return res;
    };

    const compliant = (v: Interface.IEncryption): number => {
      const Q_1 = v.cryptographicControls.yes === true || (v.cryptographicControls.yes === null && v.cryptographicControls.no === null) ? 20 : 0;

      const Q_2 = v.digitalSignature === true && !v.encryptionMethod
        ? 10
        : v.digitalSignature === true && v.encryptionMethod
          ? 20
          : v.digitalSignature === false
            ? 0
            : 20;

      const Q_3 = v.allEncryptionKeysUsed === true && !v.allEncryptionKeysMoreInfo
        ? 10
        : v.allEncryptionKeysUsed === true && v.allEncryptionKeysMoreInfo
          ? 20
          : v.allEncryptionKeysUsed === false
            ? 0
            : 20;

      const Q_4 = v.encryptionKeyRotation === true || v.encryptionKeyRotation === null ? 20 : 0;

      const Q_5 = v.allEncryptionKeysUsedInConjunction === true || v.allEncryptionKeysUsedInConjunction === null ? 20 : 0;

      const res = Q_1 + Q_2 + Q_3 + Q_4 + Q_5;
      return res;
    };
    return {
      completed: completed(val),
      compliant: compliant(val)
    };
  }

  // TOTAL SUM

  private totalSum(progressBar: ProgressBar): Equation {
    delete progressBar.total;
    const values: Equation[] = Object.values(progressBar);
    const completed = values.reduce((accumulator: number, obj: Equation) => {
      return accumulator + obj.completed;
    }, 0);

    const compliant = values.reduce((accumulator: number, obj: Equation) => {
      return accumulator + obj.compliant;
    }, 0);

    return {
      completed: Number((completed / 9).toFixed(1)),
      compliant: Number((compliant / 9).toFixed(1))
    };
  }

  // HELPER METHODS

  private checkGroupHasTrue(val: any, points: number, zeroPointFields: string[] = []): number {
    const values: any[] = Object.entries(val);
    for (const v of values) {
      const zeroPointValue = zeroPointFields.find(elem => v[0] === elem && v[1] === true);
      if (zeroPointValue) { return 0; }
      if (v[1] === true) { return points; }
    }
    return 0;
  }

  private checkGroupTrueCount(val: any): number {
    const values: any[] = Object.values(val);
    let counter = 0;
    for (const v of values) {
      if (v === true) { counter++; }
    }
    return counter;
  }

  private checkGroupTrueOrFilledCount(val: any): number {
    const values: any[] = Object.values(val);
    let counter = 0;
    // console.log('val', val);
    for (const v of values) {
      if (v) {
        counter++;
      }
    }
    return counter;
  }
}
